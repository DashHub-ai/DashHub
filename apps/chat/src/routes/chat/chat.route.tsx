import { pipe } from 'fp-ts/lib/function';
import { Redirect } from 'wouter';

import { tryOrThrowTE } from '@llm/commons';
import { useAsyncValue } from '@llm/commons-front';
import { type SdkTableRowUuidT, useSdkForLoggedIn } from '@llm/sdk';
import { SpinnerContainer } from '@llm/ui';
import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithNavigationLayout } from '~/layouts';
import { ChatConversation } from '~/modules';
import { RouteMetaTags } from '~/routes/shared';

import { useSitemap } from '../use-sitemap';

type Props = {
  id: SdkTableRowUuidT;
};

export function ChatRoute({ id }: Props) {
  const t = useI18n().pack.routes.chat;
  const sitemap = useSitemap();

  const { sdks } = useSdkForLoggedIn();
  const result = useAsyncValue(
    pipe(
      sdks.dashboard.chats.get(id),
      tryOrThrowTE,
    ),
    [id],
  );

  if (result.status === 'error') {
    return <Redirect to={sitemap.home} replace />;
  }

  return (
    <PageWithNavigationLayout>
      <RouteMetaTags meta={t.meta} />

      <LayoutHeader>
        {t.title}
      </LayoutHeader>

      <section>
        {(
          result.status === 'loading'
            ? <SpinnerContainer loading />
            : <ChatConversation chat={result.data} />
        )}
      </section>
    </PageWithNavigationLayout>
  );
}
