import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithNavigationLayout } from '~/layouts';
import { ProjectsTableContainer } from '~/modules/projects';

import { RouteMetaTags } from '../shared';

export function ProjectsRoute() {
  const t = useI18n().pack.routes.projects;

  return (
    <>
      <RouteMetaTags meta={t.meta} />
      <PageWithNavigationLayout>
        <LayoutHeader>
          {t.title}
        </LayoutHeader>

        <ProjectsTableContainer />
      </PageWithNavigationLayout>
    </>
  );
}
