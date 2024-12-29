import { pipe } from 'fp-ts/lib/function';

import { concatUrls, withSearchParams } from '@llm/commons';
import { defineSitemapRouteGenerator } from '@llm/ui';

export function useSitemap() {
  const sitemap = {
    home: prefixWithBaseRoute('/'),
    projects: {
      index: prefixWithBaseRoute('/projects'),
      show: defineSitemapRouteGenerator(prefixWithBaseRoute)('/projects/:id'),
    },
    apps: {
      index: prefixWithBaseRoute('/apps'),
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
