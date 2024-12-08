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

export const ChatConversationWithSidebar = memo(({ chat, initialMessages }: Props) => (
  <div className="flex gap-6 mx-auto max-w-7xl">
    <ChatConversationPanel
      className="top-3 sticky h-[calc(100vh-200px)]"
      chat={chat}
      initialMessages={initialMessages}
    />

    <ChatConfigPanel defaultValue={chat} />
  </div>
));
