import { Link } from 'wouter';

import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithNavigationLayout } from '~/layouts';
import { RouteMetaTags } from '~/routes/shared';

import { useSitemap } from '../use-sitemap';

export function ProjectRoute() {
  const sitemap = useSitemap();
  const { pack } = useI18n();
  const t = pack.routes.project;

  return (
    <PageWithNavigationLayout>
      <RouteMetaTags meta={t.meta} />

      <LayoutHeader
        breadcrumbs={(
          <li>
            <Link href={sitemap.projects.index}>
              {pack.routes.projects.title}
            </Link>
          </li>
        )}
      >
        {t.title}
      </LayoutHeader>

      <section>
        Mia mia mia
      </section>
    </PageWithNavigationLayout>
  );
}
