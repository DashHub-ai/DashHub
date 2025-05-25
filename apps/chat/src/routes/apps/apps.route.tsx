import { useControlStrict } from '@under-control/forms';
import { DownloadIcon, WandSparklesIcon } from 'lucide-react';
import { Link } from 'wouter';

import { useSdkForLoggedIn } from '@dashhub/sdk';
import { AgentsLibraryContainer, isPremiumEnabled } from '~/commercial/index';
import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithSidebarLayout } from '~/layouts';
import { AppsContainer } from '~/modules';
import { RouteMetaTags, useSitemap } from '~/routes';
import { type SectionTabId, SectionTabs } from '~/ui/components';

import { AppsTutorial } from './apps-tutorial';

export function AppsRoute() {
  const t = useI18n().pack.routes.apps;
  const sitemap = useSitemap();
  const { guard } = useSdkForLoggedIn();

  const tabsControl = useControlStrict<SectionTabId>({
    defaultValue: 'installed',
  });

  const renderAppsContainer = () => (
    <AppsContainer
      storeDataInUrl
      {...guard.is.minimum.techUser && {
        toolbar: (
          <Link
            href={sitemap.apps.create.generate({})}
            className="uk-button uk-button-primary uk-button-small"
          >
            <WandSparklesIcon className="mr-2" size={16} />
            {t.buttons.create}
          </Link>
        ),
      }}
    />
  );

  return (
    <PageWithSidebarLayout contentSpaceClassName="space-y-7">
      <RouteMetaTags meta={t.meta} />

      <LayoutHeader>
        {t.title}
      </LayoutHeader>

      <AppsTutorial />

      <div className="flex flex-col">
        {isPremiumEnabled() && guard.is.minimum.techUser
          ? (
              <SectionTabs
                tabs={[
                  {
                    id: 'installed',
                    name: t.tabs.installed,
                    icon: <WandSparklesIcon size={16} />,
                    content: renderAppsContainer,
                  },
                  {
                    id: 'marketplace',
                    name: t.tabs.marketplace,
                    icon: <DownloadIcon size={16} />,
                    content: () => <AgentsLibraryContainer />,
                  },
                ]}
                {...tabsControl.bind.entire()}
              />
            )
          : renderAppsContainer()}
      </div>
    </PageWithSidebarLayout>
  );
}
