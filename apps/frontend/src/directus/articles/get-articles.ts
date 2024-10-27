import { readItems } from '@directus/sdk';

import { directusSdk } from '../sdk-client';

type ArticlesFetchAttrs = {
  limit: number;
  offset?: number;
};

export function getArticles({ limit, offset = 0 }: ArticlesFetchAttrs) {
  return directusSdk.request(
    readItems('Article', {
      fields: ['*', { author: ['*'] }],
      sort: ['-published_date'],
      offset,
      limit,
    }),
  );
}
