import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithNavigationLayout } from '~/layouts';
import { RouteMetaTags } from '~/routes/shared';

export function AppsRoute() {
  const t = useI18n().pack.routes.apps;

  return (
    <PageWithNavigationLayout>
      <RouteMetaTags meta={t.meta} />

      <LayoutHeader>
        {t.title}
      </LayoutHeader>
    </PageWithNavigationLayout>
  );
}
