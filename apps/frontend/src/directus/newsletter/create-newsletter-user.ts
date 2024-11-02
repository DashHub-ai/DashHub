import { createItem } from '@directus/sdk';

import { directusSdk } from '../sdk-client';

export function createNewsletterUser(email: string) {
  return directusSdk.request(
    createItem('Newsletter_List', {
      email,
    }),
  );
}
