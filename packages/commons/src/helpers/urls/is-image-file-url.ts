export function isImageFileUrl(url: string): boolean {
  return /\.(?:jpeg|jpg|gif|png|svg|webp|bmp)$/i.test(url);
}
