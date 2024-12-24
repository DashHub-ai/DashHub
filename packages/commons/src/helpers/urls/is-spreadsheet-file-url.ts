export function isSpreadsheetFileUrl(url: string): boolean {
  return /\.(?:xls|xlsx|csv)$/i.test(url);
}
