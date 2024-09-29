export function uniq<I>(array: I[]): I[] {
  return Array.from(new Set(array));
}
