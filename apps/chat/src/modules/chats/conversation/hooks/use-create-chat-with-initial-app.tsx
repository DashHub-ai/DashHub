import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import { useLocation } from 'wouter';

import { format, tapTaskEither } from '@llm/commons';
import { getSdkAppMentionInChat, type SdkTableRowWithIdT, useSdkForLoggedIn } from '@llm/sdk';
import { useSaveErrorNotification } from '@llm/ui';
import { useI18n } from '~/i18n';
import { useWorkspaceOrganizationOrThrow } from '~/modules/workspace';
import { useSitemap } from '~/routes';

import type { InitialChatMessageT } from './use-send-initial-message';

export function useCreateChatWithInitialApp() {
  const [, navigate] = useLocation();
  const sitemap = useSitemap();
  const { organization, assignWorkspaceOrganization } = useWorkspaceOrganizationOrThrow();
  const { sdks } = useSdkForLoggedIn();
  const showErrorNotification = useSaveErrorNotification();
  const { prompts } = useI18n().pack.chat;

  return (app: SdkTableRowWithIdT) => pipe(
    TE.Do,
    TE.bind('aiModel', () => sdks.dashboard.aiModels.getDefault(organization.id)),
    TE.bindW('chat', () => sdks.dashboard.chats.create(
      assignWorkspaceOrganization({
        public: false,
      }),
    )),
    TE.bindW('app', ({ chat }) => sdks.dashboard.chats.attachApp(chat.id, {
      app,
    })),
    tapTaskEither(
      ({ chat, aiModel }) => {
        const initialPrompt = format(prompts.explainApp, {
          mention: getSdkAppMentionInChat(app),
        });

        navigate(
          sitemap.chat.generate({ pathParams: { id: chat.id } }),
          {
            state: {
              message: {
                aiModel,
                content: initialPrompt,
              } satisfies InitialChatMessageT,
            },
          },
        );
      },
      showErrorNotification,
    ),
  );
};
