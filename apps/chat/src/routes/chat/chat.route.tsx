import { apply, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { Link, Redirect } from 'wouter';

import { tryOrThrowTE } from '@llm/commons';
import { useAsyncValue } from '@llm/commons-front';
import { type SdkTableRowUuidT, useSdkForLoggedIn } from '@llm/sdk';
import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithNavigationLayout } from '~/layouts';
import { ChatConversationWithSidebar } from '~/modules';
import { RouteMetaTags } from '~/routes/shared';
import { SpinnerContainer } from '~/ui';

import { useSitemap } from '../use-sitemap';
import { ShareChatRow } from './share-chat-row';

type Props = {
  id: SdkTableRowUuidT;
};

export function ChatRoute({ id }: Props) {
  const { pack } = useI18n();
  const t = pack.routes.chat;
  const sitemap = useSitemap();

  const { sdks, createRecordGuard } = useSdkForLoggedIn();

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

  const project = result.status === 'success' && result.data.chat.project;
  const { can } = result.status === 'success' ? createRecordGuard(result.data.chat) : {};

  return (
    <PageWithNavigationLayout
      withFooter={false}
      backgroundClassName="bg-white"
      contentClassName="pb-0"
    >
      <RouteMetaTags meta={t.meta} />

      <LayoutHeader
        {...result.status === 'success' && {
          currentBreadcrumb: result.data.chat.summary.name.value || t.title,
        }}

        {...project && !project.internal && {
          breadcrumbs: (
            <>
              <li>
                <Link href={sitemap.projects.index.generate({})}>
                  {pack.routes.projects.title}
                </Link>
              </li>

              <li>
                <Link href={sitemap.projects.show.generate({ pathParams: { id: project.id } })}>
                  {project.name}
                </Link>
              </li>
            </>
          ),
        }}
      />

      <section className="relative">
        {result.status === 'loading' && <SpinnerContainer loading />}
        {result.status === 'success' && (
          <>
            {can?.write && (
              <ShareChatRow
                chat={result.data.chat}
                onPermissionsUpdated={result.silentReload}
              />
            )}

            <ChatConversationWithSidebar {...result.data} />
          </>
        )}
      </section>
    </PageWithNavigationLayout>
  );
}
