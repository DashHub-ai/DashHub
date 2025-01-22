export function isCSVMimeType(mimeType: string): boolean {
  return /^text\/csv$/i.test(mimeType);
}
