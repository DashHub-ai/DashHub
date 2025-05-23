import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import { useLocation } from 'wouter';

import { runTaskAsVoid, tapTaskEither, tryOrThrowTE } from '@dashhub/commons';
import { useAsyncCallback } from '@dashhub/commons-front';
import { type SdkTableRowWithIdT, useSdkForLoggedIn } from '@dashhub/sdk';
import { useWorkspaceOrganizationOrThrow } from '~/modules/workspace';
import { useSitemap } from '~/routes';
import { useSaveErrorNotification } from '~/ui';

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
