import { dropFirstSlash } from './drop-first-slash';
import { dropLastSlash } from './drop-last-slash';
import { isAbsoluteUrl } from './is-absolute-url';

export function concatUrls(a: string, b: string): string {
  if (!a && b) {
    return b;
  }

  if (!b || b === '/') {
    return a;
  }

  if (b.startsWith('//')) {
    b = `https:${b}`;
  }

  if (!a || isAbsoluteUrl(b)) {
    return b;
  }

  const truncatedLeft = dropLastSlash(a);
  const truncatedRight = dropFirstSlash(b);

  if (truncatedRight[0] === '?') {
    return `${truncatedLeft}${truncatedRight}`;
  }

  return [truncatedLeft, truncatedRight].join('/');
}
