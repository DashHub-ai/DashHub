import { WandSparklesIcon } from 'lucide-react';
import { Link } from 'wouter';

import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithNavigationLayout } from '~/layouts';
import { AppsContainer } from '~/modules';
import { RouteMetaTags, useSitemap } from '~/routes';

import { AppsTutorial } from './apps-tutorial';

export function AppsRoute() {
  const t = useI18n().pack.routes.apps;
  const sitemap = useSitemap();

  return (
    <PageWithNavigationLayout>
      <RouteMetaTags meta={t.meta} />

      <LayoutHeader>
        {t.title}
      </LayoutHeader>

      <AppsTutorial />

      <AppsContainer
        toolbar={(
          <Link
            to={sitemap.apps.editor.new}
            className="flex items-center uk-button uk-button-primary uk-button-small"
          >
            <WandSparklesIcon className="mr-2" size={16} />
            {t.buttons.create}
          </Link>
        )}
      />
    </PageWithNavigationLayout>
  );
}
