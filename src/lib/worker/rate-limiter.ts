/**
 * Cubeta de tokens por clave (empresa de Siigo). Siigo permite 100 peticiones/minuto por empresa;
 * usamos 90 por defecto para dejar margen a otras integraciones de la misma empresa.
 */
export class RateLimiter {
  private buckets = new Map<string, { tokens: number; last: number }>();
  constructor(
    private readonly perMinute = 90,
    private readonly now: () => number = Date.now,
    private readonly sleep: (ms: number) => Promise<void> = (ms) => new Promise((r) => setTimeout(r, ms)),
  ) {}

  /** Espera hasta que haya un token disponible para `key` y lo consume. */
  async take(key: string): Promise<void> {
    for (;;) {
      const t = this.now();
      const b = this.buckets.get(key) ?? { tokens: this.perMinute, last: t };
      b.tokens = Math.min(this.perMinute, b.tokens + ((t - b.last) / 60_000) * this.perMinute);
      b.last = t;
      if (b.tokens >= 1) {
        b.tokens -= 1;
        this.buckets.set(key, b);
        return;
      }
      this.buckets.set(key, b);
      await this.sleep(Math.ceil(((1 - b.tokens) / this.perMinute) * 60_000));
    }
  }
}
