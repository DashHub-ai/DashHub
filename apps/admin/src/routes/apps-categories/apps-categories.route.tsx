import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithNavigationLayout } from '~/layouts';
import { AppsCategoriesTableContainer } from '~/modules/apps-categories';

import { RouteMetaTags } from '../shared';

export function AppsCategoriesRoute() {
  const t = useI18n().pack.routes.appsCategories;

  return (
    <>
      <RouteMetaTags meta={t.meta} />
      <PageWithNavigationLayout>
        <LayoutHeader>
          {t.title}
        </LayoutHeader>

        <AppsCategoriesTableContainer />
      </PageWithNavigationLayout>
    </>
  );
}
