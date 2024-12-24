export function isPresentationFileUrl(url: string): boolean {
  return /\.(?:ppt|pptx)$/i.test(url);
}
