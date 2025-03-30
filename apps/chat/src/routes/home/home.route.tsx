import { useI18n } from '~/i18n';
import { PageWithSidebarLayout } from '~/layouts';
import { StartChatForm } from '~/modules';
import { PromotedAppsContainer } from '~/modules/apps/promoted-apps';
import { RouteMetaTags } from '~/routes/shared';

export function HomeRoute() {
  const t = useI18n().pack.routes.home;

  return (
    <PageWithSidebarLayout
      contentClassName="flex align-stretch"
      withFooter={false}
    >
      <RouteMetaTags meta={t.meta} />

      <div className="gap-8 grid grid-rows-[1fr_auto] mx-auto w-full max-w-5xl">
        <div className="relative">
          <div className="top-0 right-0 left-0 absolute flex flex-col justify-start [@media(min-height:825px)]:justify-center h-full overflow-y-auto">
            <PromotedAppsContainer
              title={t.exploreApps}
              className="mb-16 w-full"
            />
          </div>
        </div>

        <StartChatForm className="mt-auto pb-4" />
      </div>
    </PageWithSidebarLayout>
  );
}
