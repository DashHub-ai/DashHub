import { memo } from 'react';

import type { SdkChatT, SdKSearchMessagesOutputT } from '@llm/sdk';

import { useUpdateEffect } from '@llm/commons-front';

import { ChatBackground } from './chat-background';
import { ChatConfigPanel } from './config-panel';
import { getLastUsedAIModel } from './helpers';
import {
  useAutoFocusConversationInput,
  useReplyConversationHandler,
  useSendInitialMessage,
} from './hooks';
import { ChatInputToolbar } from './input-toolbar';
import { ChatMessage } from './messages/chat-message';

type Props = {
  chat: SdkChatT;
  initialMessages: SdKSearchMessagesOutputT;
};

export const ChatConversation = memo(({ chat, initialMessages }: Props) => {
  const {
    inputRef,
    messagesContainerRef,
    focusInput,
  } = useAutoFocusConversationInput();

  const { messages, onReply } = useReplyConversationHandler({
    chat,
    initialMessages,
  });

  const aiModel = getLastUsedAIModel(messages.items);

  useSendInitialMessage(onReply);
  useUpdateEffect(focusInput, [messages]);

  return (
    <div className="flex gap-6 mx-auto max-w-7xl">
      <div className="top-3 sticky flex flex-col flex-1 h-[calc(100vh-200px)]">
        <ChatBackground />

        <div
          ref={messagesContainerRef}
          className="relative z-10 flex-1 [&::-webkit-scrollbar]:hidden p-4 [-ms-overflow-style:none] overflow-y-scroll [scrollbar-width:none]"
        >
          {messages.items.map((message, index) => (
            <ChatMessage
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              message={message}
              isLast={index === messages.items.length - 1}
              readOnly={chat.archived}
            />
          ))}
        </div>

        {!chat.archived && (
          <ChatInputToolbar
            disabled={!aiModel}
            inputRef={inputRef}
            onSubmit={input => onReply({
              content: input.content,
              aiModel: aiModel!,
            })}
          />
        )}
      </div>

      <ChatConfigPanel defaultValue={chat} />
    </div>
  );
});
