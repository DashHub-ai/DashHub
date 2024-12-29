import { Redirect } from 'wouter';

import { useSitemap } from '../use-sitemap';

export function ManagementRoute() {
  const sitemap = useSitemap();

  return <Redirect to={sitemap.management.users} replace />;
}
