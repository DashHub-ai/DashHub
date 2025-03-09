import { pipe } from 'fp-ts/lib/function';
import { Redirect } from 'wouter';

import { tryOrThrowTE } from '@llm/commons';
import { useAsyncValue } from '@llm/commons-front';
import { type SdkTableRowIdT, useSdkForLoggedIn } from '@llm/sdk';
import { useI18n } from '~/i18n';
import { PageWithSidebarLayout } from '~/layouts';
import { RouteMetaTags } from '~/routes/shared';
import { SpinnerContainer } from '~/ui';

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
    <PageWithSidebarLayout
      navigationProps={{
        simplified: true,
      }}
    >
      <RouteMetaTags meta={t.meta} />

      <section>
        {(
          result.status === 'loading'
            ? <SpinnerContainer loading />
            : <ProjectContent project={result.data} onShared={result.silentReload} />
        )}
      </section>
    </PageWithSidebarLayout>
  );
}
