import { safeToArray } from '../safe-to-array';

export type DecodedSearchParams = Record<string, any>;

export function decodeSearchParams(url: string): DecodedSearchParams {
  const entries = [...new URLSearchParams(url.split('?')[1] || '').entries()];

  return entries.reduce<DecodedSearchParams>((acc, [key, value]) => {
    if (key.endsWith('[]')) {
      const truncatedKey = key.slice(0, -2);
      const prevValue
        = truncatedKey in acc ? safeToArray(acc[truncatedKey]) : [];

      acc[truncatedKey] = [...prevValue, value];
    }
    else {
      acc[key] = value;
    }

    return acc;
  }, Object.create({}));
}
