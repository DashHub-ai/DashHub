import clsx from 'clsx';
import { memo } from 'react';

import type {
  SdkChatT,
  SdKSearchMessagesOutputT,
} from '@llm/sdk';

import { ChatConversationPanel } from './chat-conversation-panel';
import { ChatConfigPanel } from './config-panel';

type Props = {
  chat: SdkChatT;
  initialMessages: SdKSearchMessagesOutputT;
};

export const ChatConversationWithSidebar = memo(({ chat, initialMessages }: Props) => {
  const heightClassName = 'h-[calc(100vh-190px)]';

  return (
    <div className="flex gap-6 mx-auto max-w-7xl">
      <ChatConversationPanel
        className={heightClassName}
        chat={chat}
        initialMessages={initialMessages}
      />

      <ChatConfigPanel
        defaultValue={chat}
        contentClassName={clsx(heightClassName, 'overflow-y-auto')}
      />
    </div>
  );
});
