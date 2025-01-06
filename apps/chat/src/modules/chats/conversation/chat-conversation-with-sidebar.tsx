import clsx from 'clsx';
import { memo } from 'react';

import type {
  SdkChatT,
  SdkSearchMessagesOutputT,
} from '@llm/sdk';

import { ChatConversationPanel } from './chat-conversation-panel';
import { ChatConfigPanel } from './config-panel';

type Props = {
  chat: SdkChatT;
  initialMessages: SdkSearchMessagesOutputT;
};

export const ChatConversationWithSidebar = memo(({ chat, initialMessages }: Props) => {
  const heightClassName = 'h-[calc(100vh-143px)]';

  return (
    <div className="flex gap-6 mx-auto">
      <ChatConversationPanel
        className={heightClassName}
        chat={chat}
        initialMessages={initialMessages}
      />

      <ChatConfigPanel
        chat={chat}
        contentClassName={clsx(heightClassName, 'overflow-y-auto')}
      />
    </div>
  );
});
