import * as esb from 'elastic-builder';

import type { SdkOffsetPaginationInputT } from '@dashhub/sdk';

/**
 * Creates a new instance of the search query with pagination.
 * It uses most naive pagination approach by setting the `from` and `size` properties.
 *
 * If you want to use something more advanced like `search_after` or `search_before`,
 * you can create a new function that will return a new instance of the search query with these properties.
 */
export function createPaginationOffsetSearchQuery(
  {
    limit,
    offset = 0,
  }: SdkOffsetPaginationInputT,
) {
  const query = esb
    .requestBodySearch()
    .size(Math.max(0, limit));

  return query.from(Math.max(0, offset));
}
