import { useI18n } from '~/i18n';
import { PageWithNavigationLayout } from '~/layouts';
import { ChatsHistorySection, StartChatForm } from '~/modules';
import { RouteMetaTags } from '~/routes/shared';

import { HomeTutorial } from './home-tutorial';

export function HomeRoute() {
  const t = useI18n().pack.routes.home;

  return (
    <PageWithNavigationLayout>
      <RouteMetaTags meta={t.meta} />

      <div className="pt-8">
        <section className="mx-auto px-4 max-w-3xl container">
          <h2 className="mb-6 font-semibold text-2xl text-center">
            {t.hello}
          </h2>
          <StartChatForm />
        </section>

        <HomeTutorial className="mx-auto mt-8" />

        <hr className="border-gray-200 mx-auto my-12 border-t max-w-2xl" />

        <ChatsHistorySection />
      </div>
    </PageWithNavigationLayout>
  );
}
