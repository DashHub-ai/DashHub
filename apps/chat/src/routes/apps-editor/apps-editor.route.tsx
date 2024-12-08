import { Link } from 'wouter';

import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithNavigationLayout } from '~/layouts';
import { RouteMetaTags } from '~/routes/shared';

import { useSitemap } from '../use-sitemap';

export function AppsEditorRoute() {
  const sitemap = useSitemap();
  const { pack } = useI18n();
  const t = pack.routes.appsEditor;

  return (
    <PageWithNavigationLayout>
      <RouteMetaTags meta={t.meta} />

      <LayoutHeader
        breadcrumbs={(
          <li>
            <Link href={sitemap.apps.index}>
              {pack.routes.apps.title}
            </Link>
          </li>
        )}
      >
        {t.title}
      </LayoutHeader>
    </PageWithNavigationLayout>
  );
}
