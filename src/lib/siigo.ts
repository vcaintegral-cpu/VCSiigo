/**
 * Cliente seguro de Siigo Nube API v1 (solo servidor).
 *
 * - Autenticación: POST {base}/auth con { username, access_key } -> { access_token, expires_in }.
 *   El token dura ~24 h; se renueva automáticamente (margen de seguridad) y ante un 401.
 * - Encabezados obligatorios en cada llamada: Authorization (token) y Partner-Id.
 * - Reintentos con backoff ante 429 / 5xx; respeta Retry-After.
 * - Paginación: iterador asíncrono sobre page / page_size.
 *
 * Verificado contra developers.siigo.com (22-nov-2026):
 *  - Límite: 100 peticiones/minuto POR EMPRESA de Siigo → pausa mínima 650 ms entre llamadas.
 *  - Timeout recomendado ≥ 120 s (la creación de comprobantes puede tardar).
 *  - Header opcional `Idempotency-Key` (alfanumérico, ≤30 car.) en POST de invoices, credit-notes,
 *    journals y vouchers: permite reintentar sin duplicar.
 *  - Se bloquea al usuario API si >80 % de sus requests fallan durante 7 días.
 *  - NO existe listado (GET) de /v1/purchases ni /v1/purchase-support-documents: solo por id.
 *  - NO existe endpoint de PUC ni de cuentas por cobrar; sí /v1/accounts-payable.
 *  - Las líneas de facturas/compras NO traen cuenta contable; sí las traen journals, vouchers y payment-receipts.
 */

export type SiigoConfig = {
  username: string;
  accessKey: string;
  partnerId: string;
  baseUrl?: string;
  /** Pausa mínima entre llamadas (ms) para no exceder límites de tasa. */
  minIntervalMs?: number;
  fetchImpl?: typeof fetch;
};

export const SIIGO_ENDPOINTS = {
  auth: "/auth",
  // Documentos (históricos)
  ventas: "/v1/invoices",
  compras: "/v1/purchases",
  documentosSoporte: "/v1/purchase-support-documents", // solo por id (sin listado)
  comprobantes: "/v1/journals",
  recibosCaja: "/v1/vouchers",
  recibosPago: "/v1/payment-receipts",
  notasCredito: "/v1/credit-notes",
  // Maestros
  terceros: "/v1/customers",
  productos: "/v1/products",
  impuestos: "/v1/taxes",
  centrosCosto: "/v1/cost-centers",
  tiposComprobante: "/v1/document-types",
  grupos: "/v1/account-groups",
  cuentasPorPagar: "/v1/accounts-payable",
  balancePruebaTercero: "/v1/test-balance-report-by-thirdparty", // POST → URL de Excel
  balancePrueba: "/v1/test-balance-report", // POST → URL de Excel
  webhooks: "/v1/webhooks",
} as const;

export class SiigoError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown,
    public path?: string,
  ) {
    super(message);
    this.name = "SiigoError";
  }
}

type TokenState = { token: string; expiresAt: number };

export type Paginado<T> = {
  pagination?: { page: number; page_size: number; total_results: number };
  results: T[];
};

const SAFETY_MARGIN_MS = 5 * 60 * 1000; // renovar 5 min antes de expirar
const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class SiigoClient {
  private readonly cfg: Required<Omit<SiigoConfig, "fetchImpl">> & { fetchImpl: typeof fetch };
  private tokenState: TokenState | null = null;
  private refreshing: Promise<string> | null = null;
  private lastCall = 0;

  constructor(cfg: SiigoConfig) {
    if (!cfg.username || !cfg.accessKey || !cfg.partnerId) {
      throw new Error("Siigo: username, accessKey y partnerId son obligatorios");
    }
    this.cfg = {
      baseUrl: (cfg.baseUrl ?? "https://api.siigo.com").replace(/\/+$/, ""),
      minIntervalMs: cfg.minIntervalMs ?? 650,
      fetchImpl: cfg.fetchImpl ?? fetch,
      username: cfg.username,
      accessKey: cfg.accessKey,
      partnerId: cfg.partnerId,
    };
  }

  /** Obtiene un token vigente (renovando si falta poco para expirar). Evita autenticaciones concurrentes. */
  async getToken(force = false): Promise<string> {
    const now = Date.now();
    if (!force && this.tokenState && this.tokenState.expiresAt - SAFETY_MARGIN_MS > now) {
      return this.tokenState.token;
    }
    if (this.refreshing) return this.refreshing;
    this.refreshing = this.authenticate().finally(() => {
      this.refreshing = null;
    });
    return this.refreshing;
  }

  private async authenticate(): Promise<string> {
    const res = await this.cfg.fetchImpl(`${this.cfg.baseUrl}${SIIGO_ENDPOINTS.auth}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Partner-Id": this.cfg.partnerId },
      body: JSON.stringify({ username: this.cfg.username, access_key: this.cfg.accessKey }),
    });
    const body = await safeJson(res);
    if (!res.ok || !body?.access_token) {
      throw new SiigoError(`Siigo auth falló (HTTP ${res.status})`, res.status, redact(body), SIIGO_ENDPOINTS.auth);
    }
    const ttl = typeof body.expires_in === "number" ? body.expires_in * 1000 : DEFAULT_TTL_MS;
    this.tokenState = { token: body.access_token as string, expiresAt: Date.now() + ttl };
    return this.tokenState.token;
  }

  /** Petición autenticada con reintentos. */
  async request<T = unknown>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    opts: { query?: Record<string, string | number | boolean | undefined>; body?: unknown; idempotencyKey?: string } = {},
  ): Promise<T> {
    const url = new URL(this.cfg.baseUrl + path);
    for (const [k, v] of Object.entries(opts.query ?? {})) {
      if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
    }

    let refreshed = false;
    for (let attempt = 0; attempt < 5; attempt++) {
      await this.throttle();
      const token = await this.getToken();
      const res = await this.cfg.fetchImpl(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          "Partner-Id": this.cfg.partnerId,
          ...(opts.idempotencyKey ? { "Idempotency-Key": opts.idempotencyKey.replace(/[^a-zA-Z0-9]/g, "").slice(0, 30) } : {}),
        },
        body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
        signal: AbortSignal.timeout(120_000),
      });

      if (res.status === 401 && !refreshed) {
        refreshed = true;
        await this.getToken(true);
        continue;
      }
      if (res.status === 429 || res.status >= 500) {
        const ra = Number(res.headers.get("retry-after"));
        await sleep(Number.isFinite(ra) && ra > 0 ? ra * 1000 : 1000 * 2 ** attempt);
        continue;
      }
      const body = await safeJson(res);
      if (!res.ok) {
        throw new SiigoError(`Siigo ${method} ${path} -> HTTP ${res.status}`, res.status, body, path);
      }
      return body as T;
    }
    throw new SiigoError(`Siigo ${method} ${path}: reintentos agotados`, 0, undefined, path);
  }

  get<T = unknown>(path: string, query?: Record<string, string | number | boolean | undefined>) {
    return this.request<T>("GET", path, { query });
  }

  /** Una página de un listado. */
  async page<T = Record<string, unknown>>(
    path: string,
    page: number,
    query: Record<string, string | number | boolean | undefined> = {},
    pageSize = 100,
  ): Promise<{ results: T[]; hasMore: boolean; total?: number }> {
    const data = await this.get<Paginado<T> | T[]>(path, { ...query, page, page_size: pageSize });
    const results = Array.isArray(data) ? data : (data.results ?? []);
    const total = Array.isArray(data) ? undefined : data.pagination?.total_results;
    const hasMore = total !== undefined ? page * pageSize < total : results.length >= pageSize;
    return { results, hasMore, total };
  }

  /** Recorre todas las páginas de un listado. */
  async *paginate<T = Record<string, unknown>>(
    path: string,
    query: Record<string, string | number | boolean | undefined> = {},
    pageSize = 100,
    startPage = 1,
  ): AsyncGenerator<{ items: T[]; page: number; total?: number }> {
    let page = startPage;
    for (;;) {
      const { results, hasMore, total } = await this.page<T>(path, page, query, pageSize);
      if (results.length) yield { items: results, page, total };
      if (!hasMore || results.length === 0) return;
      page++;
    }
  }

  /** Prueba de conexión: autentica y pide 1 registro de un maestro liviano. */
  async probar(): Promise<{ ok: true; tiposComprobante: number }> {
    await this.getToken(true);
    const r = await this.page(SIIGO_ENDPOINTS.tiposComprobante, 1, {}, 25);
    return { ok: true, tiposComprobante: r.results.length };
  }

  private async throttle() {
    const wait = this.lastCall + this.cfg.minIntervalMs - Date.now();
    if (wait > 0) await sleep(wait);
    this.lastCall = Date.now();
  }
}

async function safeJson(res: Response): Promise<any> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text.slice(0, 500) };
  }
}

/** Nunca registrar credenciales en errores. */
function redact(body: any) {
  if (!body || typeof body !== "object") return body;
  const { access_token, access_key, ...rest } = body;
  void access_token;
  void access_key;
  return rest;
}

/** Cliente desde variables de entorno (scripts locales). */
export function siigoFromEnv(): SiigoClient {
  return new SiigoClient({
    username: process.env.SIIGO_USERNAME ?? "",
    accessKey: process.env.SIIGO_ACCESS_KEY ?? "",
    partnerId: process.env.SIIGO_PARTNER_ID ?? "",
    baseUrl: process.env.SIIGO_BASE_URL,
  });
}
