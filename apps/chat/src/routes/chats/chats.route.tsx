import { useI18n } from '~/i18n';
import { PageWithSidebarLayout } from '~/layouts';
import { ChatsFavoriteSection, ChatsHistorySection, StartChatForm } from '~/modules';
import { RouteMetaTags } from '~/routes/shared';

export function ChatsRoute() {
  const t = useI18n().pack.routes.chats;

  return (
    <PageWithSidebarLayout>
      <RouteMetaTags meta={t.meta} />

      <div className="pt-8">
        <section className="mx-auto px-4 max-w-3xl container">
          <h2 className="mb-6 font-semibold text-2xl text-center">
            {t.hello}
          </h2>
          <StartChatForm />
        </section>

        <hr className="mx-auto my-12 border-gray-200 border-t max-w-2xl" />

        <div className="flex flex-col gap-8 md:gap-12 lg:gap-16">
          <ChatsFavoriteSection />
          <ChatsHistorySection />
        </div>
      </div>
    </PageWithSidebarLayout>
  );
}
