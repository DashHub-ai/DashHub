import { pipe } from 'fp-ts/lib/function';

import type {
  SearchAppsRouteUrlFiltersT,
  SearchProjectsRouteUrlFiltersT,
} from '~/modules';

import { concatUrls, withSearchParams } from '@llm/commons';
import { defineSitemapRouteGenerator } from '~/ui';

export function useSitemap() {
  const sitemap = {
    home: prefixWithBaseRoute('/'),
    projects: {
      index: defineSitemapRouteGenerator<SearchProjectsRouteUrlFiltersT>(prefixWithBaseRoute)('/projects'),
      show: defineSitemapRouteGenerator(prefixWithBaseRoute)('/projects/:id'),
    },
    apps: {
      index: defineSitemapRouteGenerator<SearchAppsRouteUrlFiltersT>(prefixWithBaseRoute)('/apps'),
      create: defineSitemapRouteGenerator(prefixWithBaseRoute)('/apps/create'),
      update: defineSitemapRouteGenerator(prefixWithBaseRoute)('/apps/edit/:id'),
    },
    experts: prefixWithBaseRoute('/experts'),
    login: prefixWithBaseRoute('/login'),
    chat: defineSitemapRouteGenerator(prefixWithBaseRoute)('/chat/:id'),
    pinnedMessages: {
      index: defineSitemapRouteGenerator(prefixWithBaseRoute)('/pinned-messages'),
    },
    management: {
      index: prefixWithBaseRoute('/management'),
      users: prefixWithBaseRoute('/management/users'),
      usersGroups: prefixWithBaseRoute('/management/users-groups'),
      aiModels: prefixWithBaseRoute('/management/ai-models'),
      s3Buckets: prefixWithBaseRoute('/management/s3-buckets'),
      searchEngines: prefixWithBaseRoute('/management/search-engines'),
    },
    settings: {
      index: prefixWithBaseRoute('/settings'),
      me: prefixWithBaseRoute('/settings/me'),
      organization: prefixWithBaseRoute('/settings/organization'),
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

export function prefixWithBaseRoute(path?: string) {
  return concatUrls(import.meta.env.BASE_URL ?? '/', path ?? '');
}
