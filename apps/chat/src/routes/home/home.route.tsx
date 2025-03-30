import { useI18n } from '~/i18n';
import { PageWithSidebarLayout } from '~/layouts';
import { StartChatForm } from '~/modules';
import { PromotedAppsContainer } from '~/modules/apps/promoted-apps';
import { RouteMetaTags } from '~/routes/shared';

export function HomeRoute() {
  const t = useI18n().pack.routes.home;

  return (
    <PageWithSidebarLayout contentClassName="flex align-stretch">
      <RouteMetaTags meta={t.meta} />

      <div className="grid grid-rows-[1fr_auto] mx-auto w-full max-w-5xl">
        <div className="flex flex-col justify-center">
          <PromotedAppsContainer
            title={t.exploreApps}
            className="mb-16 w-full min-h-[490px]"
          />
        </div>

        <StartChatForm className="mt-auto" />
      </div>
    </PageWithSidebarLayout>
  );
}
