import { WandSparklesIcon } from 'lucide-react';
import { Link } from 'wouter';

import { useSdkForLoggedIn } from '@llm/sdk';
import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithSidebarLayout } from '~/layouts';
import { AppsContainer } from '~/modules';
import { RouteMetaTags, useSitemap } from '~/routes';

import { AppsTutorial } from './apps-tutorial';

export function AppsRoute() {
  const t = useI18n().pack.routes.apps;
  const sitemap = useSitemap();
  const { guard } = useSdkForLoggedIn();

  return (
    <PageWithSidebarLayout>
      <RouteMetaTags meta={t.meta} />

      <LayoutHeader root>
        {t.title}
      </LayoutHeader>

      <AppsTutorial />

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
    </PageWithSidebarLayout>
  );
}
