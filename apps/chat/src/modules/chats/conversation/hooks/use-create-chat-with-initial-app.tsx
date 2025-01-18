import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import { useLocation } from 'wouter';

import { runTaskAsVoid, tapTaskEither, tryOrThrowTE } from '@llm/commons';
import { useAsyncCallback } from '@llm/commons-front';
import { type SdkTableRowWithIdT, useSdkForLoggedIn } from '@llm/sdk';
import { useSaveErrorNotification } from '@llm/ui';
import { useWorkspaceOrganizationOrThrow } from '~/modules/workspace';
import { useSitemap } from '~/routes';

export function useCreateChatWithInitialApp() {
  const [, navigate] = useLocation();
  const sitemap = useSitemap();
  const { assignWorkspaceOrganization } = useWorkspaceOrganizationOrThrow();
  const { sdks } = useSdkForLoggedIn();
  const showErrorNotification = useSaveErrorNotification();

  return useAsyncCallback(async (app: SdkTableRowWithIdT) => pipe(
    TE.Do,
    TE.bindW('chat', () => sdks.dashboard.chats.create(
      assignWorkspaceOrganization({
        public: false,
        internal: false,
      }),
    )),
    TE.bindW('app', ({ chat }) => sdks.dashboard.chats.attachApp(chat.id, {
      app,
    })),
    tapTaskEither(
      ({ chat }) => {
        navigate(
          sitemap.chat.generate({ pathParams: { id: chat.id } }),
        );
      },
      showErrorNotification,
    ),
    tryOrThrowTE,
    runTaskAsVoid,
  ));
};
