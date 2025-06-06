import { pipe } from 'fp-ts/lib/function';
import { Redirect, useLocation } from 'wouter';

import { tryOrThrowTE } from '@dashhub/commons';
import { useAsyncValue } from '@dashhub/commons-front';
import { type SdkTableRowIdT, useSdkForLoggedIn } from '@dashhub/sdk';
import { useI18n } from '~/i18n';
import { LayoutHeader, PageFormSection, PageWithSidebarLayout } from '~/layouts';
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

      <PageFormSection>
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
      </PageFormSection>
    </PageWithSidebarLayout>
  );
}
