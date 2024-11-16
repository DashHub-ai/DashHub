import { pipe } from 'fp-ts/lib/function';

import type { SdkTableRowIdT } from '@llm/sdk';
import type {
  SearchOrganizationsRouteUrlFiltersT,
  SearchUsersRouteUrlFiltersT,
} from '~/modules';

import { concatUrls, withSearchParams } from '@llm/commons';
import { defineSitemapRouteGenerator } from '@llm/ui';

export function useSitemap() {
  const sitemap = {
    home: prefixWithBaseRoute('/'),
    login: prefixWithBaseRoute('/login'),
    organizations: {
      index: defineSitemapRouteGenerator<SearchOrganizationsRouteUrlFiltersT>(prefixWithBaseRoute)('/organizations'),
      show: (id: SdkTableRowIdT) => sitemap.organizations.index.generate({
        searchParams: {
          archived: null,
          ids: [id],
        },
      }),
    },
    apps: {
      index: defineSitemapRouteGenerator(prefixWithBaseRoute)('/apps'),
    },
    projects: {
      index: defineSitemapRouteGenerator<SearchUsersRouteUrlFiltersT>(prefixWithBaseRoute)('/projects'),
    },
    users: {
      index: defineSitemapRouteGenerator<SearchUsersRouteUrlFiltersT>(prefixWithBaseRoute)('/users'),
    },
    s3Buckets: {
      index: defineSitemapRouteGenerator(prefixWithBaseRoute)('/s3-buckets'),
    },
    aiModels: {
      index: defineSitemapRouteGenerator(prefixWithBaseRoute)('/ai-models'),
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

function prefixWithBaseRoute(path: string) {
  return concatUrls(import.meta.env.BASE_URL ?? '/', path);
}
