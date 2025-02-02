import { pipe } from 'fp-ts/lib/function';
import { Redirect } from 'wouter';

import { tryOrThrowTE } from '@llm/commons';
import { useAsyncValue } from '@llm/commons-front';
import { type SdkTableRowIdT, useSdkForLoggedIn } from '@llm/sdk';
import { useI18n } from '~/i18n';
import { LayoutBreadcrumbs, LayoutHeader, PageWithNavigationLayout } from '~/layouts';
import { AppUpdateForm, useCreateChatWithInitialApp } from '~/modules';
import { RouteMetaTags, useSitemap } from '~/routes';
import { SpinnerContainer } from '~/ui';

type Props = {
  id: SdkTableRowIdT;
};

export function UpdateAppRoute({ id }: Props) {
  const t = useI18n().pack.routes.editApp;
  const sitemap = useSitemap();
  const { sdks } = useSdkForLoggedIn();
  const [createChatWithApp] = useCreateChatWithInitialApp();

  const result = useAsyncValue(
    pipe(
      sdks.dashboard.apps.get(id),
      tryOrThrowTE,
    ),
    [id],
  );

  if (result.status === 'error') {
    return <Redirect to={sitemap.projects.index.generate({})} replace />;
  }

  const onAfterSubmit = () => {
    void createChatWithApp();
  };

  return (
    <PageWithNavigationLayout>
      <RouteMetaTags meta={t.meta} />

      <LayoutBreadcrumbs currentBreadcrumb={t.title} />

      <section className="flex flex-col gap-6 mx-auto max-w-4xl">
        <LayoutHeader withBreadcrumbs={false}>
          {(
            result.status === 'loading'
              ? t.title
              : `${t.title} - ${result.data.name}`
          )}
        </LayoutHeader>

        {(
          result.status === 'loading'
            ? <SpinnerContainer loading />
            : <AppUpdateForm app={result.data} onAfterSubmit={onAfterSubmit} />
        )}
      </section>
    </PageWithNavigationLayout>
  );
}
