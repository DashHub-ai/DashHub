import { hasUrlProtocol } from './has-url-protocol';

/**
 * Adds a default protocol to a URL if it doesn't have one.
 */
export function defaultUrlProtocol(protocol: string) {
  return (url: string) => {
    let mappedUrl = url;

    if (!hasUrlProtocol(mappedUrl)) {
      mappedUrl = `${protocol}://${url}`;
    }

    return mappedUrl;
  };
}
