/**
 * Confianza de una regla = proporción de uso × factor de muestra × factor de vigencia.
 *  - proporción: evidencia / total del grupo (tercero + tipo + rol [+ concepto]).
 *  - muestra: n / (n + K); con K=2, una sola observación no pasa de 0.33.
 *  - vigencia: -15 % si la última vez fue hace más de 18 meses.
 * Techo 0.99 (nunca "certeza absoluta").
 */
export const K_MUESTRA = 2;

export function calcularConfianza(evidencia: number, total: number, ultimaVez: string | null, hoy = new Date()): number {
  if (total <= 0 || evidencia <= 0) return 0;
  const proporcion = evidencia / total;
  const muestra = evidencia / (evidencia + K_MUESTRA);
  let vigencia = 1;
  if (ultimaVez) {
    const meses = (hoy.getTime() - new Date(ultimaVez).getTime()) / (1000 * 60 * 60 * 24 * 30.44);
    if (meses > 18) vigencia = 0.85;
  }
  return Math.min(0.99, Math.round(proporcion * muestra * vigencia * 10000) / 10000);
}
