import { isEmpty } from 'fp-ts/lib/Record';

import { decodeSearchParams } from './decode-search-params';
import { dropSearchParams } from './drop-search-params';
import {
  encodeSearchParams,
  type SearchParamsMap,
} from './encode-search-params';

export function withSearchParams(params: SearchParamsMap) {
  return (url: string) => {
    if (isEmpty(params)) {
      return url;
    }

    const mergedParams = {
      ...decodeSearchParams(url),
      ...params,
    };

    if (isEmpty(mergedParams)) {
      return dropSearchParams(url);
    }

    let searchStr = encodeSearchParams(mergedParams);
    if (searchStr) {
      searchStr = `?${searchStr}`;
    }

    return `${dropSearchParams(url)}${searchStr}`;
  };
}
