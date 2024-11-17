import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithNavigationLayout } from '~/layouts';
import { ChatConversation } from '~/modules';
import { RouteMetaTags } from '~/routes/shared';

export function ChatRoute() {
  const t = useI18n().pack.routes.chat;

  return (
    <PageWithNavigationLayout>
      <RouteMetaTags meta={t.meta} />

      <LayoutHeader>
        {t.title}
      </LayoutHeader>

      <section>
        <ChatConversation />
      </section>
    </PageWithNavigationLayout>
  );
}
