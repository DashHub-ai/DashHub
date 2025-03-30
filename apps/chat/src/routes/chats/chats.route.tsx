import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithSidebarLayout } from '~/layouts';
import { ChatsHistorySection } from '~/modules';
import { RouteMetaTags } from '~/routes/shared';

export function ChatsRoute() {
  const t = useI18n().pack.routes.chats;

  return (
    <PageWithSidebarLayout>
      <RouteMetaTags meta={t.meta} />

      <LayoutHeader>
        {t.title}
      </LayoutHeader>

      <ChatsHistorySection />
    </PageWithSidebarLayout>
  );
}
