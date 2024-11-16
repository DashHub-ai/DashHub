import { useI18n } from '~/i18n';
import { PageWithNavigationLayout } from '~/layouts';
import { ChatsHistorySection, StartChatSection } from '~/modules';
import { RouteMetaTags } from '~/routes/shared';

import { HomeTutorial } from './home-tutorial';

export function HomeRoute() {
  const t = useI18n().pack.routes.home;

  return (
    <PageWithNavigationLayout>
      <RouteMetaTags meta={t.meta} />

      <section className="pt-8">
        <StartChatSection />

        <HomeTutorial className="mx-auto mt-8" />

        <hr className="border-gray-200 mx-auto my-12 border-t max-w-2xl" />

        <ChatsHistorySection />

      </section>
    </PageWithNavigationLayout>
  );
}
