import { useControlStrict } from '@under-control/forms';
import { DownloadIcon, WandSparklesIcon } from 'lucide-react';
import { Link } from 'wouter';

import { useSdkForLoggedIn } from '@dashhub/sdk';
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

  const tabs = [
    {
      id: 'installed',
      name: t.tabs.installed,
      icon: <WandSparklesIcon size={16} />,
      content: () => (
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
      ),
    },
    {
      id: 'marketplace',
      name: t.tabs.marketplace,
      icon: <DownloadIcon size={16} />,
      content: () => (
        <div className="py-8 text-slate-500 dark:text-slate-400 text-center">
          Marketplace content coming soon...
        </div>
      ),
    },
  ];

  return (
    <PageWithSidebarLayout>
      <RouteMetaTags meta={t.meta} />

      <LayoutHeader>
        {t.title}
      </LayoutHeader>

      <AppsTutorial />

      <div className="flex flex-col">
        <SectionTabs
          tabs={tabs}
          {...tabsControl.bind.entire()}
        />
      </div>
    </PageWithSidebarLayout>
  );
}
