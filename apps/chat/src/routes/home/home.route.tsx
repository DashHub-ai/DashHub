import { Redirect } from 'wouter';

import { useHasWorkspaceOrganization } from '~/modules';

import { useSitemap } from '../use-sitemap';

export function HomeRoute() {
  const sitemap = useSitemap();
  const hasOrganization = useHasWorkspaceOrganization();

  const path = (
    hasOrganization
      ? sitemap.apps.index.generate({})
      : sitemap.home
  );

  return <Redirect to={path} replace />;
}
