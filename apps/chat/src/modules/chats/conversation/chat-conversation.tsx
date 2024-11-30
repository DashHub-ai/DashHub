import { memo, useMemo, useState } from 'react';

import { findItemById } from '@llm/commons';
import { useUpdateEffect } from '@llm/commons-front';
import {
  getLastUsedSdkMessagesAIModel,
  groupSdkAIMessagesByRepeats,
  type SdkChatT,
  type SdKSearchMessagesOutputT,
} from '@llm/sdk';

import type { SdkRepeatedMessageItemT } from './messages/chat-message';

import { ChatBackground } from './chat-background';
import { ChatConfigPanel } from './config-panel';
import {
  extractOptimisticMessageContent,
  useAutoFocusConversationInput,
  useReplyConversationHandler,
  useSendInitialMessage,
} from './hooks';
import { ChatInputToolbar, type ChatInputValue } from './input-toolbar';
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

  const [replyToMessage, setReplyToMessage] = useState<SdkRepeatedMessageItemT | null>(null);
  const { messages, replying, onReply, onRefreshAIResponse } = useReplyConversationHandler({
    chat,
    initialMessages,
  });

  const { groupedMessages, aiModel } = useMemo(
    () => ({
      groupedMessages: groupSdkAIMessagesByRepeats(messages.items),
      aiModel: getLastUsedSdkMessagesAIModel(messages.items),
    }),
    [messages.items],
  );

  const onRefreshResponse = ({ repliedMessage }: Pick<SdkRepeatedMessageItemT, 'repliedMessage'>) => {
    if (!repliedMessage) {
      return;
    }

    const lastUserMessage = findItemById(repliedMessage.id)(messages.items);
    if (!lastUserMessage) {
      return;
    }

    void onRefreshAIResponse({
      message: {
        ...lastUserMessage,
        content: extractOptimisticMessageContent(lastUserMessage),
      },
      aiModel: aiModel!,
    });
  };

  const onSendChatMessage = (message: ChatInputValue) => {
    setReplyToMessage(null);

    return onReply({
      ...message,
      replyToMessage: replyToMessage && {
        ...replyToMessage,
        content: extractOptimisticMessageContent(replyToMessage),
      },
      aiModel: aiModel!,
    });
  };

  useSendInitialMessage(onReply);
  useUpdateEffect(focusInput, [messages, replyToMessage]);

  return (
    <div className="flex gap-6 mx-auto max-w-7xl">
      <div className="top-3 sticky flex flex-col flex-1 h-[calc(100vh-200px)]">
        <ChatBackground />

        <div
          ref={messagesContainerRef}
          className="relative z-10 flex-1 [&::-webkit-scrollbar]:hidden p-4 [-ms-overflow-style:none] overflow-y-scroll [scrollbar-width:none]"
        >
          {groupedMessages.map((message, index) => (
            <ChatMessage
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              message={message}
              isLast={index === groupedMessages.length - 1}
              readOnly={chat.archived}
              onRefreshResponse={onRefreshResponse}
              onReply={setReplyToMessage}
            />
          ))}
        </div>

        {!chat.archived && (
          <ChatInputToolbar
            replyToMessage={replyToMessage}
            replying={replying}
            disabled={!aiModel}
            inputRef={inputRef}
            onSubmit={onSendChatMessage}
            onCancelSubmit={() => {
              messages.replyObservable?.abort();
            }}
            onCancelReplyToMessage={() => {
              setReplyToMessage(null);
            }}
          />
        )}
      </div>

      <ChatConfigPanel defaultValue={chat} />
    </div>
  );
});
