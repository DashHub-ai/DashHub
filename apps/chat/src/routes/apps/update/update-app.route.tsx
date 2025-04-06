import { pipe } from 'fp-ts/lib/function';
import { Redirect } from 'wouter';

import { tryOrThrowTE } from '@llm/commons';
import { useAsyncValue } from '@llm/commons-front';
import { type SdkTableRowIdT, useSdkForLoggedIn } from '@llm/sdk';
import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithSidebarLayout } from '~/layouts';
import { AppUpdateForm, useCreateChatWithInitialApp } from '~/modules';
import { RouteMetaTags, useSitemap } from '~/routes';
import { SpinnerContainer } from '~/ui';

type Props = {
  id: SdkTableRowIdT;
};

export function UpdateAppRoute({ id }: Props) {
  const { pack } = useI18n();
  const t = pack.routes.editApp;

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
    void createChatWithApp({ id });
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
            : <AppUpdateForm app={result.data} onAfterSubmit={onAfterSubmit} />
        )}
      </section>
    </PageWithSidebarLayout>
  );
}
