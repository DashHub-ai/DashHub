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

      <div className="gap-5 grid grid-rows-[1fr_auto] mx-auto w-full max-w-5xl">
        <div className="relative">
          <div className="top-0 right-0 left-0 absolute flex flex-col justify-start [@media(min-height:870px)]:justify-center h-full overflow-y-auto">
            <div className="mb-8">
              <h1 className="mb-2 font-bold text-3xl">{t.header.primary}</h1>
              <h2 className="text-gray-500 text-xl">{t.header.secondary}</h2>
            </div>
            <PromotedAppsContainer className="mb-24 w-full" />
          </div>
        </div>

        <StartChatForm className="mt-auto pb-4" />
      </div>
    </PageWithSidebarLayout>
  );
}
