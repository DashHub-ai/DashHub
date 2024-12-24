export function isDocumentFileUrl(url: string): boolean {
  return /\.(?:doc|docx|pdf|txt|rtf)$/i.test(url);
}
