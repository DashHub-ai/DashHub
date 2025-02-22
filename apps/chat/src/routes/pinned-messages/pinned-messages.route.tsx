import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithNavigationLayout } from '~/layouts';
import { PinnedMessagesContainer } from '~/modules';
import { RouteMetaTags } from '~/routes';

export function PinnedMessagesRoute() {
  const t = useI18n().pack.routes.pinnedMessages;

  return (
    <PageWithNavigationLayout>
      <RouteMetaTags meta={t.meta} />

      <LayoutHeader>
        {t.title}
      </LayoutHeader>

      <PinnedMessagesContainer storeDataInUrl />
    </PageWithNavigationLayout>
  );
}
