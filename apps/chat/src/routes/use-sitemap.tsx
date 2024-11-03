import { prefixWithBaseRoute } from '@llm/ui';

export function useSitemap() {
  const sitemap = {
    projects: prefixWithBaseRoute('/projects'),
    login: prefixWithBaseRoute('/login'),
  };

  return sitemap;
};
