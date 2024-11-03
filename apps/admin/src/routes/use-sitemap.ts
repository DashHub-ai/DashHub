import { pipe } from 'fp-ts/lib/function';

import type { SdkTableRowIdT } from '@llm/sdk';
import type {
  SearchOrganizationsRouteUrlFiltersT,
  SearchUsersRouteUrlFiltersT,
} from '~/modules';

import { withSearchParams } from '@llm/commons';
import { defineSitemapRouteGenerator, prefixWithBaseRoute } from '@llm/ui';

export function useSitemap() {
  const sitemap = {
    home: prefixWithBaseRoute('/'),
    login: prefixWithBaseRoute('/login'),
    organizations: {
      index: defineSitemapRouteGenerator<SearchOrganizationsRouteUrlFiltersT>()('/organizations'),
      show: (id: SdkTableRowIdT) => sitemap.organizations.index.generate({
        searchParams: {
          archived: null,
          ids: [id],
        },
      }),
    },
    apps: {
      index: defineSitemapRouteGenerator()('/apps'),
    },
    projects: {
      index: defineSitemapRouteGenerator<SearchUsersRouteUrlFiltersT>()('/projects'),
    },
    users: {
      index: defineSitemapRouteGenerator<SearchUsersRouteUrlFiltersT>()('/users'),
    },
    s3Buckets: {
      index: defineSitemapRouteGenerator()('/s3-buckets'),
    },
    forceRedirect: {
      raw: prefixWithBaseRoute('/force-redirect'),
      generate: (targetUrl: string) => pipe(
        '/force-redirect',
        withSearchParams({ targetUrl: btoa(targetUrl) }),
        prefixWithBaseRoute,
      ),
    },
  };

  return sitemap;
};
