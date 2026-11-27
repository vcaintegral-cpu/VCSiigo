import { describe, expect, it } from "vitest";
import { parseBalanceGeneral, parseBalanceTercero } from "../src/lib/balance/parse";

const enc = ["Nivel", "Transaccional", "Código cuenta contable", "Nombre Cuenta contable", "Saldo Inicial", "Movimiento Débito", "Movimiento Crédito", "Saldo final"];
describe("balance de prueba general (estructura real de Siigo)", () => {
  const filas: unknown[][] = [
    ["Balance de prueba general"], ["EMPRESA DE PRUEBA SAS"], ["900123456"], ["Del 01/01/2026 al 30/11/2026"], enc,
    ["Clase", "No", "1", "ACTIVO", 100, 10, 5, 105],
    ["Cuenta", "No", "1105", "CAJA", 0, 0, 0, 0],
    ["Auxiliar", "Sí", "11050501", "Caja general", 50, 1, 2, 49],
    ["Auxiliar", "Si", "51959501", "Otros gastos", 0, 7, 0, 7],
  ];
  it("extrae PUC, nivel, transaccional, NIT y periodo", () => {
    const r = parseBalanceGeneral(filas);
    expect(r.nitEmpresa).toBe("900123456");
    expect(r.periodo).toMatch(/2026/);
    expect(r.filas).toHaveLength(4);
    expect(r.filas[2]).toMatchObject({ codigo: "11050501", nivel: "Auxiliar", transaccional: true, saldoFinal: 49 });
    expect(r.filas[1]!.transaccional).toBe(false);
  });
  it("falla con un archivo que no es un balance", () => {
    expect(() => parseBalanceGeneral([["a", "b"], [1, 2]])).toThrow(/Código cuenta contable/);
  });
});

describe("balance por tercero", () => {
  const e2 = ["Nivel", "Transaccional", "Código cuenta contable", "Nombre Cuenta contable", "Identificación", "Sucursal", "Nombre tercero", "Saldo Inicial", "Movimiento Débito", "Movimiento Crédito", "Saldo final"];
  it("ignora filas de totales y devuelve cuenta+tercero", () => {
    const r = parseBalanceTercero([["Balance de prueba por tercero"], ["EMPRESA"], ["900123456"], ["2026"], e2,
      ["Cuenta", "No", "1305", "CLIENTES", null, null, null, 10, 0, 0, 10],
      ["Auxiliar", "Sí", "13050501", "Clientes nacionales", "800111222", "0", "ACME SAS", 10, 5, 3, 12]]);
    expect(r.filas).toHaveLength(1);
    expect(r.filas[0]).toMatchObject({ codigo: "13050501", terceroNit: "800111222", sucursal: "0", terceroNombre: "ACME SAS", saldoFinal: 12 });
  });
});
