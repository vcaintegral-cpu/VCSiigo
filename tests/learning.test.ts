import { describe, expect, it } from "vitest";
import { agregarReglas } from "../src/lib/learning/aggregate";
import { lineasDeAuxiliarCsv } from "../src/lib/learning/auxiliar-csv";
import { calcularConfianza } from "../src/lib/learning/confidence";
import { lineasDeAsiento, lineasDeFactura } from "../src/lib/learning/extract";
import { rolPorCuenta, rolPorTipoImpuesto } from "../src/lib/learning/puc";

describe("PUC", () => {
  it("clasifica cuentas", () => {
    expect(rolPorCuenta("24080101")).toBe("iva");
    expect(rolPorCuenta("236540")).toBe("retefuente");
    expect(rolPorCuenta("236701")).toBe("reteiva");
    expect(rolPorCuenta("236801")).toBe("reteica");
    expect(rolPorCuenta("135515")).toBe("retefuente");
    expect(rolPorCuenta("220505")).toBe("contrapartida_cxp");
    expect(rolPorCuenta("130505")).toBe("contrapartida_cxc");
    expect(rolPorCuenta("111005")).toBe("banco_caja");
    expect(rolPorCuenta("413595")).toBe("ingreso");
    expect(rolPorCuenta("519595")).toBe("gasto_costo");
  });
});

describe("confianza", () => {
  it("crece con la muestra y cae si el tercero usa cuentas distintas", () => {
    const hoy = new Date("2026-11-18");
    expect(calcularConfianza(1, 1, "2026-10-01", hoy)).toBeCloseTo(0.3333, 3);
    expect(calcularConfianza(10, 10, "2026-10-01", hoy)).toBeGreaterThan(0.8);
    expect(calcularConfianza(5, 10, "2026-10-01", hoy)).toBeLessThan(0.4);
    expect(calcularConfianza(10, 10, "2020-01-01", hoy)).toBeLessThan(calcularConfianza(10, 10, "2026-10-01", hoy));
  });
});

describe("extracción y agregación", () => {
  const asiento = (n: number, cuenta = "513525") => ({
    date: `2026-0${n}-10`,
    items: [
      { account: { code: cuenta, movement: "Debit" }, customer: { identification: "900123456" }, value: 100000, description: "Servicio de aseo mes 1" },
      { account: { code: "24081001", movement: "Debit" }, customer: { identification: "900123456" }, value: 19000 },
      { account: { code: "236540", movement: "Credit" }, customer: { identification: "900123456" }, value: 4000 },
      { account: { code: "220505", movement: "Credit" }, customer: { identification: "900123456" }, value: 115000 },
    ],
  });

  it("aprende cuentas por tercero desde comprobantes", () => {
    const lineas = [1, 2, 3, 4].flatMap((n) => lineasDeAsiento("comprobante", asiento(n)));
    const reglas = agregarReglas(lineas, new Date("2026-11-18"));
    const gasto = reglas.find((r) => r.rolLinea === "gasto_costo" && r.concepto === "");
    expect(gasto).toMatchObject({ terceroNit: "900123456", cuentaPuc: "513525", evidenciaN: 4, totalN: 4 });
    expect(reglas.some((r) => r.rolLinea === "gasto_costo" && r.concepto === "servicio aseo mes")).toBe(true);
    expect(reglas.find((r) => r.rolLinea === "retefuente")?.cuentaPuc).toBe("236540");
  });

  it("baja la confianza cuando el tercero usa dos cuentas", () => {
    const lineas = [
      ...[1, 2, 3].flatMap((n) => lineasDeAsiento("comprobante", asiento(n, "513525"))),
      ...lineasDeAsiento("comprobante", asiento(4, "519595")),
    ];
    const g = agregarReglas(lineas).filter((r) => r.rolLinea === "gasto_costo" && r.concepto === "");
    const a = g.find((r) => r.cuentaPuc === "513525")!;
    const b = g.find((r) => r.cuentaPuc === "519595")!;
    expect(a.confianza).toBeGreaterThan(b.confianza);
    expect(a.totalN).toBe(4);
  });

  it("aprende tarifas de IVA y retención de una factura de compra", () => {
    const doc = {
      date: "2026-05-02", supplier: { identification: "800111222" },
      items: [{ description: "Papelería", price: 100000, quantity: 1, total: 100000, taxes: [{ name: "IVA 19%", percentage: 19, value: 19000 }] }],
      retentions: [{ name: "Retefuente compras", percentage: 2.5, value: 2500 }],
    };
    const r = agregarReglas(lineasDeFactura("compra", doc));
    expect(r.find((x) => x.rolLinea === "iva")?.tarifa).toBe(19);
    expect(r.find((x) => x.rolLinea === "retefuente")?.tarifa).toBe(2.5);
    expect(r.find((x) => x.rolLinea === "gasto_costo")?.cuentaPuc).toBe(""); // payload sin cuenta
  });
});

describe("auxiliar CSV", () => {
  it("mapea columnas flexibles, formato colombiano e infiere tarifas", () => {
    const csv = [
      "Fecha;Comprobante;Número;Cuenta;NIT;Débito;Crédito;Detalle",
      "05/03/2026;FC-1;10;513525;900123456;100.000,00;0;Aseo",
      "05/03/2026;FC-1;10;24081001;900123456;19.000,00;0;IVA",
      "05/03/2026;FC-1;10;220505;900123456;0;119.000,00;CxP",
    ].join("\n");
    const r = lineasDeAuxiliarCsv(csv);
    expect(r.error).toBeNull();
    expect(r.lineas).toHaveLength(3);
    expect(r.lineas[0]).toMatchObject({ tipoDocumento: "compra", fecha: "2026-03-05", valor: 100000 });
    expect(r.lineas.find((l) => l.rol === "iva")?.tarifa).toBe(19);
  });
});

describe("documentos reales de Siigo (formas verificadas)", () => {
  it("compra con líneas tipo Account: la cuenta viene en items.code y los impuestos traen su tipo", () => {
    const doc = {
      date: "2026-11-05", supplier: { identification: "800123456", branch_office: 0 },
      items: [{ type: "Account", code: "51959501", description: "Servicio mantenimiento 11", quantity: 1, price: 100000, total: 100000,
        taxes: [{ id: 1, name: "IVA 19%", type: "IVA", percentage: 19, value: 19000 }, { id: 2, name: "Retefuente 4%", type: "Retefuente", percentage: 4, value: 4000 }] }],
      retentions: [],
    };
    const r = agregarReglas(lineasDeFactura("compra", doc), new Date("2026-11-18"));
    expect(r.find((x) => x.rolLinea === "gasto_costo" && x.concepto === "")).toMatchObject({ cuentaPuc: "51959501", terceroNit: "800123456" });
    expect(r.find((x) => x.rolLinea === "iva")?.tarifa).toBe(19);
    expect(r.find((x) => x.rolLinea === "retefuente")?.tarifa).toBe(4);
  });
  it("documento soporte con Retefuente 3,5 % por ítem", () => {
    const doc = { date: "2026-11-05", supplier: { identification: "1037000111" },
      items: [{ type: "Account", code: "51201001", description: "Honorarios", total: 500000, taxes: [{ type: "Retefuente", percentage: 3.5, value: 17500 }] }] };
    const r = agregarReglas(lineasDeFactura("documento_soporte", doc));
    expect(r.find((x) => x.rolLinea === "retefuente")).toMatchObject({ tarifa: 3.5, tipoDocumento: "documento_soporte" });
  });
  it("clasifica tipos de impuesto", () => {
    expect(rolPorTipoImpuesto("ReteICA")).toBe("reteica");
    expect(rolPorTipoImpuesto("ReteIVA")).toBe("reteiva");
    expect(rolPorTipoImpuesto("IVA")).toBe("iva");
    expect(rolPorTipoImpuesto("Autoretención")).toBe("autorretencion");
    expect(rolPorTipoImpuesto("Impoconsumo")).toBe("impoconsumo");
  });
});

describe("ID de impuesto (varios IVA 19 % distintos en Siigo)", () => {
  it("aprende qué impuesto usa cada proveedor, no solo la tarifa", () => {
    const mk = (id: number) => ({ date: "2026-10-05", supplier: { identification: "800123456" },
      items: [{ type: "Account", code: "51959501", description: "Servicio", total: 100, taxes: [{ id, name: "IVA", type: "IVA", percentage: 19, value: 19 }] }] });
    const lineas = [41566, 41566, 41566, 8977].flatMap((id) => lineasDeFactura("compra", mk(id)));
    const iva = agregarReglas(lineas).filter((r) => r.rolLinea === "iva" && r.concepto === "");
    const principal = iva.find((r) => r.impuestoId === "41566")!;
    expect(principal.evidenciaN).toBe(3);
    expect(principal.tarifa).toBe(19);
    expect(iva.find((r) => r.impuestoId === "8977")?.evidenciaN).toBe(1);
    expect(principal.confianza).toBeGreaterThan(iva.find((r) => r.impuestoId === "8977")!.confianza);
  });
  it("comprobantes: la línea de impuesto aporta id y porcentaje", () => {
    const r = lineasDeAsiento("comprobante", { date: "2026-10-01", items: [{ account: { code: "24082502", movement: "Debit" }, customer: { identification: "900111222" }, tax: { id: 8977, type: "IVA", percentage: 19, base_value: 1000 }, value: 190 }] });
    expect(r[0]).toMatchObject({ impuestoId: "8977", tarifa: 19, rol: "iva" });
  });
});
