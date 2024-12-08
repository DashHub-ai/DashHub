import { apply, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { Redirect } from 'wouter';

import { tryOrThrowTE } from '@llm/commons';
import { useAsyncValue } from '@llm/commons-front';
import { type SdkTableRowUuidT, useSdkForLoggedIn } from '@llm/sdk';
import { SpinnerContainer } from '@llm/ui';
import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithNavigationLayout } from '~/layouts';
import { ChatConversationWithSidebar } from '~/modules';
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
      apply.sequenceS(TE.ApplicativePar)({
        chat: sdks.dashboard.chats.get(id),
        initialMessages: pipe(
          sdks.dashboard.chats.searchMessages(id, {
            offset: 0,
            limit: 100,
            sort: 'createdAt:desc',
          }),
          TE.map(({ items, ...pagination }) => ({
            ...pagination,
            items: items.toReversed(),
          })),
        ),
      }),
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
            : <ChatConversationWithSidebar {...result.data} />
        )}
      </section>
    </PageWithNavigationLayout>
  );
}
