import { concatUrls } from '@llm/commons';

export function useSitemap() {
  const sitemap = {
    home: prefixWithBaseRoute('/'),
    projects: prefixWithBaseRoute('/projects'),
    apps: prefixWithBaseRoute('/apps'),
    experts: prefixWithBaseRoute('/experts'),
    login: prefixWithBaseRoute('/login'),
    settings: prefixWithBaseRoute('/settings'),
  };

  return sitemap;
};

function prefixWithBaseRoute(path: string) {
  return concatUrls(import.meta.env.BASE_URL ?? '/', path);
}
