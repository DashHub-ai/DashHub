import { useI18n } from '~/i18n';
import { PageWithSidebarLayout } from '~/layouts';
import { StartChatForm } from '~/modules';
import { PromotedAppsContainer } from '~/modules/apps/promoted-apps';
import { RouteMetaTags } from '~/routes/shared';

import { AnimatedGradientTitle } from './animated-gradient-title';

export function HomeRoute() {
  const t = useI18n().pack.routes.home;

  return (
    <PageWithSidebarLayout
      contentClassName="flex align-stretch"
      navigationProps={{
        className: 'mb-0',
      }}
      withFooter={false}
    >
      <RouteMetaTags meta={t.meta} />

      <div className="z-10 relative gap-5 grid grid-rows-[1fr_auto] mx-auto w-full max-w-6xl">
        <div className="relative">
          <div className="top-0 right-0 left-0 absolute flex flex-col justify-start [@media(min-height:980px)]:justify-center h-full overflow-y-auto">
            <div className="mb-8 [@media(max-height:980px)]:pt-5">
              <h1 className="mb-5 font-bold text-3xl">
                <AnimatedGradientTitle>
                  {t.header.primary}
                </AnimatedGradientTitle>
              </h1>

              <h2 className="text-gray-500 text-xl">{t.header.secondary}</h2>
            </div>
            <PromotedAppsContainer className="w-full" />
          </div>
        </div>

        <StartChatForm className="mt-auto pb-4" />
      </div>
    </PageWithSidebarLayout>
  );
}
