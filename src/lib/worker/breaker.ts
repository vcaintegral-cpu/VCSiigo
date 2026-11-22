/**
 * Disyuntor por empresa. Se abre (pausa los envíos) si hay N fallos seguidos o si la proporción de
 * fallos en la ventana reciente supera el umbral. Protege contra el bloqueo de Siigo (>80 % de
 * errores durante 7 días) y evita cascadas de documentos mal enviados.
 */
export class Breaker {
  private events: { t: number; ok: boolean }[] = [];
  private consecutive = 0;
  private openUntil = 0;

  constructor(
    private readonly opts = { maxConsecutive: 5, windowMs: 15 * 60_000, minSample: 10, maxFailRatio: 0.5, cooldownMs: 30 * 60_000 },
    private readonly now: () => number = Date.now,
  ) {}

  isOpen(): boolean {
    return this.now() < this.openUntil;
  }

  /** Segundos que faltan para que se cierre (0 si está cerrado). */
  retryAfterMs(): number {
    return Math.max(0, this.openUntil - this.now());
  }

  record(ok: boolean) {
    const t = this.now();
    this.events.push({ t, ok });
    this.events = this.events.filter((e) => t - e.t <= this.opts.windowMs);
    this.consecutive = ok ? 0 : this.consecutive + 1;
    const fails = this.events.filter((e) => !e.ok).length;
    const ratio = this.events.length >= this.opts.minSample ? fails / this.events.length : 0;
    if (this.consecutive >= this.opts.maxConsecutive || ratio > this.opts.maxFailRatio) {
      this.openUntil = t + this.opts.cooldownMs;
      this.consecutive = 0;
      this.events = [];
    }
  }
}
