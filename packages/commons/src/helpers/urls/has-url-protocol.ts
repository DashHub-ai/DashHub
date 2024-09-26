/**
 * Check if a URL has a protocol.
 */
export function hasUrlProtocol(url: string) {
  return /^\w+:\/\//.test(url);
}
