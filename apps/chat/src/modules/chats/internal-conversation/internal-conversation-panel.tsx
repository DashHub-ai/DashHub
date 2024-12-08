import { apply, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { memo } from 'react';

import { tapTaskEither, tryOrThrowTE } from '@llm/commons';
import { useAsyncValue } from '@llm/commons-front';
import { type SdkChatT, useSdkForLoggedIn } from '@llm/sdk';
import { SpinnerContainer } from '@llm/ui';
import { useWorkspaceOrganizationOrThrow } from '~/modules/workspace';

import { ChatConversationPanel } from '../conversation/chat-conversation-panel';

type Props = {
  className?: string;
  initialMessage: string;
  onChatCreated?: (chat: SdkChatT) => void;
};

export const InternalConversationPanel = memo(({ className, initialMessage, onChatCreated }: Props) => {
  const { sdks } = useSdkForLoggedIn();
  const { organization, assignWorkspaceOrganization } = useWorkspaceOrganizationOrThrow();

  const result = useAsyncValue(
    pipe(
      assignWorkspaceOrganization({
        internal: true,
        public: false,
      }),
      sdks.dashboard.chats.create,
      TE.chain(({ id }) => apply.sequenceS(TE.ApplicativePar)({
        chat: sdks.dashboard.chats.get(id),
        aiModel: sdks.dashboard.aiModels.getDefault(organization.id),
      })),
      tapTaskEither(({ chat }) => {
        onChatCreated?.(chat);
      }),
      tryOrThrowTE,
    ),
    [],
  );

  if (result.status === 'loading' || result.status === 'error') {
    return <SpinnerContainer loading />;
  }

  const { chat, aiModel } = result.data;

  return (
    <ChatConversationPanel
      backdropSettings={{
        totalIcons: 16,
      }}
      className={className}
      chat={chat}
      replyAfterMount={{
        content: initialMessage,
        aiModel,
      }}
    />
  );
});
