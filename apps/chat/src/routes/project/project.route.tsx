import { pipe } from 'fp-ts/lib/function';
import { Link, Redirect } from 'wouter';

import { tryOrThrowTE } from '@llm/commons';
import { useAsyncValue } from '@llm/commons-front';
import { type SdkTableRowIdT, useSdkForLoggedIn } from '@llm/sdk';
import { Skeleton, SpinnerContainer } from '@llm/ui';
import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithNavigationLayout } from '~/layouts';
import { RouteMetaTags } from '~/routes/shared';

import { useSitemap } from '../use-sitemap';
import { ProjectContent } from './project-content';

type Props = {
  id: SdkTableRowIdT;
};

export function ProjectRoute({ id }: Props) {
  const sitemap = useSitemap();
  const { pack } = useI18n();
  const t = pack.routes.project;

  const { sdks } = useSdkForLoggedIn();
  const result = useAsyncValue(
    pipe(
      sdks.dashboard.projects.get(id),
      tryOrThrowTE,
    ),
    [id],
  );

  if (result.status === 'error') {
    return <Redirect to={sitemap.projects.index.generate({})} replace />;
  }

  return (
    <PageWithNavigationLayout>
      <RouteMetaTags meta={t.meta} />

      <LayoutHeader
        breadcrumbs={(
          <li>
            <Link href={sitemap.projects.index.generate({})}>
              {pack.routes.projects.title}
            </Link>
          </li>
        )}
        currentBreadcrumb={(
          result.status === 'success'
            ? result.data.name
            : <Skeleton className="w-32 h-[16px]" variant="dark" as="span" />
        )}
      />

      <section>
        {(
          result.status === 'loading'
            ? <SpinnerContainer loading />
            : <ProjectContent project={result.data} onShared={result.silentReload} />
        )}
      </section>
    </PageWithNavigationLayout>
  );
}
