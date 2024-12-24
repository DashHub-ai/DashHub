export function isMarkdownFileUrl(url: string): boolean {
  return /\.md$/i.test(url);
}
