import { readItem } from '@directus/sdk';

import { directusSdk } from '../sdk-client';

export function getArticle(slug: string) {
  return directusSdk.request(
    readItem('Article', slug, {
      fields: ['*', { author: ['*'] }],
      filter: {
        status: {
          _eq: 'published',
        },
      },
    }),
  );
}
