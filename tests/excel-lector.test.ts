import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import * as XLSX from "xlsx";
import { hojasDeExcel } from "../src/lib/excel-lector";

describe("lector de Excel", () => {
  it("lee un xlsx con prefijo de espacio de nombres x: (estilo .NET / Siigo)", () => {
    const hojas = hojasDeExcel(readFileSync("tests/fixtures/xlsx-prefijo-x.xlsx"));
    expect(hojas[0]!.nombre).toBe("Balance");
    expect(hojas[0]!.filas[0]).toEqual(["Cuenta", "Saldo inicial"]);
    expect(hojas[0]!.filas[1]).toEqual(["11100501", 1500]);
  });
  it("lee un xlsx normal generado en memoria", () => {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([["a", "b"], [1, 2]]), "H1");
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    expect(hojasDeExcel(buf)[0]!.filas).toEqual([["a", "b"], [1, 2]]);
  });
});
