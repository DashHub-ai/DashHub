import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithNavigationLayout } from '~/layouts';
import { RouteMetaTags } from '~/routes/shared';

export function SettingsRoute() {
  const t = useI18n().pack.routes.settings;

  return (
    <PageWithNavigationLayout>
      <RouteMetaTags meta={t.meta} />

      <LayoutHeader>
        {t.title}
      </LayoutHeader>
    </PageWithNavigationLayout>
  );
}
