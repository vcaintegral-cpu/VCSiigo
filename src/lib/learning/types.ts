export type TipoDocumento =
  | "compra"
  | "venta"
  | "documento_soporte"
  | "comprobante"
  | "recibo_caja"
  | "recibo_pago"
  | "nota_credito"
  | "auxiliar";

export type RolLinea =
  | "gasto_costo"
  | "ingreso"
  | "activo"
  | "iva"
  | "retefuente"
  | "reteica"
  | "reteiva"
  | "contrapartida_cxp"
  | "contrapartida_cxc"
  | "banco_caja"
  | "otro";

/** Una línea contable normalizada, venga de un documento de Siigo o del auxiliar en CSV. */
export type LineaContable = {
  terceroNit: string; // solo dígitos, sin DV
  tipoDocumento: TipoDocumento;
  fecha: string | null; // YYYY-MM-DD
  /** '' cuando el payload no expone la cuenta (se aprende solo la tarifa). */
  cuenta: string;
  naturaleza: "D" | "C";
  valor: number;
  rol: RolLinea;
  concepto: string; // normalizado
  tarifa: number | null; // % observado para iva / retenciones
  centroCosto: string | null;
};

export type ReglaCalculada = {
  terceroNit: string;
  tipoDocumento: TipoDocumento;
  rolLinea: RolLinea;
  concepto: string;
  cuentaPuc: string;
  naturaleza: "D" | "C";
  tarifa: number | null;
  centroCosto: string | null;
  evidenciaN: number;
  totalN: number;
  confianza: number;
  primeraVez: string | null;
  ultimaVez: string | null;
};
