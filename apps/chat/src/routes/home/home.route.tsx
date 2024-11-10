import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithNavigationLayout } from '~/layouts';
import { StartChatSection } from '~/modules';
import { RouteMetaTags } from '~/routes/shared';

export function HomeRoute() {
  const t = useI18n().pack.routes.home;

  return (
    <PageWithNavigationLayout>
      <RouteMetaTags meta={t.meta} />

      <LayoutHeader>
        {t.title}
      </LayoutHeader>

      <StartChatSection />
    </PageWithNavigationLayout>
  );
}
