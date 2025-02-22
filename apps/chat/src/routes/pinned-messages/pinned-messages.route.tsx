import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithNavigationLayout } from '~/layouts';
import { AppsContainer } from '~/modules';
import { RouteMetaTags } from '~/routes';

export function PinnedMessagesRoute() {
  const t = useI18n().pack.routes.pinnedMessages;

  return (
    <PageWithNavigationLayout>
      <RouteMetaTags meta={t.meta} />

      <LayoutHeader>
        {t.title}
      </LayoutHeader>

      <AppsContainer storeDataInUrl />
    </PageWithNavigationLayout>
  );
}
