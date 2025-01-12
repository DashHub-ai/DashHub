import clsx from 'clsx';
import { memo } from 'react';

import {
  isTechOrOwnerUserSdkOrganizationRole,
  type SdkChatT,
  type SdkSearchMessagesOutputT,
  useSdkForLoggedIn,
} from '@llm/sdk';

import { ChatConversationPanel } from './chat-conversation-panel';
import { ChatConfigPanel } from './config-panel';

type Props = {
  chat: SdkChatT;
  initialMessages: SdkSearchMessagesOutputT;
};

export const ChatConversationWithSidebar = memo(({ chat, initialMessages }: Props) => {
  const { createRecordGuard, session: { token } } = useSdkForLoggedIn();
  const { can } = createRecordGuard(chat);

  const heightClassName = (
    token.role === 'root' || isTechOrOwnerUserSdkOrganizationRole(token.organization.role)
      ? 'h-[calc(100vh-171px)]'
      : 'h-[calc(100vh-143px)]'
  );

  return (
    <div className="flex gap-6 mx-auto">
      <ChatConversationPanel
        className={heightClassName}
        chat={chat}
        initialMessages={initialMessages}
      />

      {can.write && (
        <ChatConfigPanel
          chat={chat}
          contentClassName={clsx(heightClassName, 'overflow-y-auto')}
        />
      )}
    </div>
  );
});
