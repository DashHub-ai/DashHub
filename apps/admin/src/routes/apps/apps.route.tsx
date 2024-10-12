import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithNavigationLayout } from '~/layouts';
import { AppsTableContainer } from '~/modules/apps';

import { RouteMetaTags } from '../shared';

export function AppsRoute() {
  const t = useI18n().pack.routes.apps;

  return (
    <>
      <RouteMetaTags meta={t.meta} />
      <PageWithNavigationLayout>
        <LayoutHeader>
          {t.title}
        </LayoutHeader>

        <AppsTableContainer />
      </PageWithNavigationLayout>
    </>
  );
}
