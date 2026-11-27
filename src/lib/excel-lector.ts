import * as XLSX from "xlsx";

export type HojaExcel = { nombre: string; filas: unknown[][] };

/**
 * Lee un .xlsx/.xls/.csv a matrices de celdas. Usa SheetJS porque tolera archivos generados por
 * .NET (Open XML SDK) con prefijos de espacio de nombres `x:`, como los reportes de Siigo; ExcelJS falla con ellos
 * ("Cannot read properties of undefined (reading 'sheets')", reproducido en tests/fixtures/xlsx-prefijo-x.xlsx).
 * Solo para archivos del propio usuario o de Siigo (xlsx 0.18.5 tiene avisos conocidos con archivos hostiles).
 */
export function hojasDeExcel(datos: ArrayBuffer | Uint8Array | Buffer): HojaExcel[] {
  const wb = XLSX.read(datos, { type: "buffer", cellDates: true });
  return wb.SheetNames.map((nombre) => ({
    nombre,
    filas: XLSX.utils.sheet_to_json<unknown[]>(wb.Sheets[nombre]!, { header: 1, raw: true, defval: null }),
  }));
}
