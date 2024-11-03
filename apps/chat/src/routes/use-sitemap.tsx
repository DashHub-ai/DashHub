import { concatUrls } from '@llm/commons';

export function useSitemap() {
  const sitemap = {
    projects: prefixWithBaseRoute('/projects'),
    login: prefixWithBaseRoute('/login'),
  };

  return sitemap;
};

function prefixWithBaseRoute(path: string) {
  return concatUrls(import.meta.env.BASE_URL ?? '/', path);
}
