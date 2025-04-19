import { pipe } from 'fp-ts/lib/function';
import { Redirect, useLocation } from 'wouter';

import { tryOrThrowTE } from '@llm/commons';
import { useAsyncValue } from '@llm/commons-front';
import { type SdkTableRowIdT, useSdkForLoggedIn } from '@llm/sdk';
import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithSidebarLayout } from '~/layouts';
import { AIExternalAPIUpdateForm } from '~/modules';
import { RouteMetaTags, useSitemap } from '~/routes';
import { SpinnerContainer } from '~/ui';

type Props = {
  id: SdkTableRowIdT;
};

export function UpdateAIExternalAPIRoute({ id }: Props) {
  const { pack } = useI18n();
  const t = pack.routes.editAIExternalAPI;

  const [, navigate] = useLocation();
  const sitemap = useSitemap();
  const { sdks } = useSdkForLoggedIn();

  const result = useAsyncValue(
    pipe(
      sdks.dashboard.aiExternalAPIs.get(id),
      tryOrThrowTE,
    ),
    [id],
  );

  if (result.status === 'error') {
    return <Redirect to={sitemap.aiExternalAPIs.index.generate({})} replace />;
  }

  const onAfterSubmit = () => {
    navigate(sitemap.aiExternalAPIs.index.generate({}));
  };

  return (
    <PageWithSidebarLayout>
      <RouteMetaTags meta={t.meta} />

      <section className="flex flex-col gap-6 mx-auto max-w-6xl">
        <LayoutHeader>
          {(
            result.status === 'loading'
              ? t.title
              : `${t.title} - ${result.data.name}`
          )}
        </LayoutHeader>

        {(
          result.status === 'loading'
            ? <SpinnerContainer loading />
            : <AIExternalAPIUpdateForm api={result.data} onAfterSubmit={onAfterSubmit} />
        )}
      </section>
    </PageWithSidebarLayout>
  );
}
