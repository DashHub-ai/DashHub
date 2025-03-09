import { memo } from 'react';

import {
  type SdkChatT,
  type SdkSearchMessagesOutputT,
  useSdkForLoggedIn,
} from '@llm/sdk';

import { ChatConversationPanel } from './chat-conversation-panel';
import { ChatConfigPanel } from './config-panel';

type Props = {
  chat: SdkChatT;
  initialMessages: SdkSearchMessagesOutputT;
  onSilentReload: VoidFunction;
};

export const ChatConversationWithSidebar = memo(({ chat, initialMessages, onSilentReload }: Props) => {
  const { createRecordGuard } = useSdkForLoggedIn();
  const { can } = createRecordGuard(chat);

  return (
    <div className="flex gap-6 mx-auto">
      <ChatConversationPanel
        className="h-[calc(100vh-115px)]"
        chat={chat}
        initialMessages={initialMessages}
      />

      {can.write && (
        <ChatConfigPanel
          chat={chat}
          contentClassName="overflow-y-auto"
          onSilentReload={onSilentReload}
        />
      )}
    </div>
  );
});
