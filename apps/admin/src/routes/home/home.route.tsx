import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithNavigationLayout } from '~/layouts';

import { RouteMetaTags } from '../shared';

export function HomeRoute() {
  const t = useI18n().pack.routes.home;

  return (
    <>
      <RouteMetaTags meta={t.meta} />
      <PageWithNavigationLayout>
        <LayoutHeader root>
          {t.title}
        </LayoutHeader>
      </PageWithNavigationLayout>
    </>
  );
}
