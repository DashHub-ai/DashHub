import { pipe } from 'fp-ts/lib/function';

import type {
  SearchAppsRouteUrlFiltersT,
  SearchProjectsRouteUrlFiltersT,
} from '~/modules';

import { concatUrls, withSearchParams } from '@llm/commons';
import { defineSitemapRouteGenerator } from '@llm/ui';

export function useSitemap() {
  const sitemap = {
    home: prefixWithBaseRoute('/'),
    projects: {
      index: defineSitemapRouteGenerator<SearchProjectsRouteUrlFiltersT>(prefixWithBaseRoute)('/projects'),
      show: defineSitemapRouteGenerator(prefixWithBaseRoute)('/projects/:id'),
    },
    apps: {
      index: defineSitemapRouteGenerator<SearchAppsRouteUrlFiltersT>(prefixWithBaseRoute)('/apps'),
      editor: defineSitemapRouteGenerator(prefixWithBaseRoute)('/apps/:id'),
    },
    experts: prefixWithBaseRoute('/experts'),
    login: prefixWithBaseRoute('/login'),
    settings: prefixWithBaseRoute('/settings'),
    chat: defineSitemapRouteGenerator(prefixWithBaseRoute)('/chat/:id'),
    management: {
      index: prefixWithBaseRoute('/management'),
      users: prefixWithBaseRoute('/management/users'),
      usersGroups: prefixWithBaseRoute('/management/users-groups'),
      aiModels: prefixWithBaseRoute('/management/ai-models'),
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
