import { Redirect } from 'wouter';

import { useSitemap } from '../use-sitemap';

export function SettingsRoute() {
  const sitemap = useSitemap();

  return <Redirect to={sitemap.settings.me} replace />;
}
