import { useI18n } from '~/i18n';
import { PageWithSidebarLayout } from '~/layouts';
import { StartChatForm } from '~/modules';
import { RouteMetaTags } from '~/routes/shared';

export function HomeRoute() {
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
      </div>
    </PageWithSidebarLayout>
  );
}
