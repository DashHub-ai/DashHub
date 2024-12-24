export function isPDFMimeType(mimeType: string): boolean {
  return /^application\/pdf$/i.test(mimeType);
}
