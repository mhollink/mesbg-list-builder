import * as XLSX from "xlsx";

export function readFile(filename: string): XLSX.WorkBook {
  console.log("reading file", filename)
  return XLSX.readFile(filename);
}

export function readSheet(
  workbook: XLSX.WorkBook,
  sheetName: string,
): Record<string, unknown>[] {
  console.log("reading sheet", sheetName)
  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    throw new Error(`Workbook does not contain sheet '${sheetName}'`);
  }

  return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
  });
}
