import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithSidebarLayout } from '~/layouts';
import { PinnedMessagesContainer } from '~/modules';
import { RouteMetaTags } from '~/routes';

export function PinnedMessagesRoute() {
  const t = useI18n().pack.routes.pinnedMessages;

  return (
    <PageWithSidebarLayout>
      <RouteMetaTags meta={t.meta} />

      <LayoutHeader>
        {t.title}
      </LayoutHeader>

      <PinnedMessagesContainer storeDataInUrl />
    </PageWithSidebarLayout>
  );
}
