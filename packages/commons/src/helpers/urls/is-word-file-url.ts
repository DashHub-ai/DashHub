export function isWordFileUrl(url: string): boolean {
  return /\.(?:doc|docx)$/i.test(url);
}
