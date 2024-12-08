import clsx from 'clsx';
import { memo, useEffect, useLayoutEffect, useMemo, useState } from 'react';

import { findItemById, rejectFalsyItems } from '@llm/commons';
import { useInterval } from '@llm/commons-front';
import {
  getLastUsedSdkMessagesAIModel,
  groupSdkAIMessagesByRepeats,
  type SdkChatT,
  type SdKSearchMessagesOutputT,
  type SdkTableRowWithIdNameT,
} from '@llm/sdk';

import type { SdkRepeatedMessageItemT } from './messages/chat-message';

import { ChatAttachedApp } from './chat-attached-app';
import { ChatBackground } from './chat-background';
import { ChatConfigPanel } from './config-panel';
import {
  extractOptimisticMessageContent,
  useAutoFocusConversationInput,
  useReplyConversationHandler,
  useScrollFlickeringIndicator,
  useSendInitialMessage,
} from './hooks';
import { ChatInputToolbar, type ChatInputValue } from './input-toolbar';
import { ChatMessage } from './messages/chat-message';

type Props = {
  chat: SdkChatT;
  initialMessages: SdKSearchMessagesOutputT;
};

export const ChatConversation = memo(({ chat, initialMessages }: Props) => {
  const flickeringIndicator = useScrollFlickeringIndicator();
  const {
    inputRef,
    messagesContainerRef,
    focusInput,
    scrollConversation,
  } = useAutoFocusConversationInput();

  const [replyToMessage, setReplyToMessage] = useState<SdkRepeatedMessageItemT | null>(null);
  const { messages, replying, onReply, onRefreshAIResponse, onAttachApp } = useReplyConversationHandler({
    chat,
    initialMessages,
  });

  const apps = useMemo(
    () => rejectFalsyItems(messages.items.map(({ app }) => app)),
    [messages.items],
  );

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

  const onAction = (action: string) => {
    void onSendChatMessage({
      content: action,
    });
  };

  const onSelectApp = (app: SdkTableRowWithIdNameT) => {
    if (!findItemById(app.id)(apps)) {
      void onAttachApp({
        app,
        aiModel: aiModel!,
      });
    }
  };

  const renderMessage = (message: SdkRepeatedMessageItemT, index: number) => {
    if (message.app) {
      return (
        <ChatAttachedApp key={index} app={message.app} />
      );
    }

    return (
      <ChatMessage
        key={index}
        message={message}
        isLast={index === groupedMessages.length - 1}
        readOnly={chat.archived}
        onRefreshResponse={onRefreshResponse}
        onReply={setReplyToMessage}
        onAction={onAction}
      />
    );
  };

  useSendInitialMessage(onReply);
  useLayoutEffect(focusInput, [messages, replyToMessage]);
  useInterval(focusInput, 1, { maxTicks: 50 });

  useEffect(() => {
    if (!messages.replyObservable) {
      return;
    }

    return messages.replyObservable.subscribe(scrollConversation);
  }, [messages.replyObservable]);

  return (
    <div className="flex gap-6 mx-auto max-w-7xl">
      <div className="top-3 sticky flex flex-col flex-1 h-[calc(100vh-200px)]">
        <ChatBackground />

        <div
          ref={messagesContainerRef}
          className={clsx(
            'relative z-10 flex-1 [&::-webkit-scrollbar]:hidden p-4 [-ms-overflow-style:none] overflow-y-scroll [scrollbar-width:none]',
            flickeringIndicator.visible ? 'opacity-100' : 'opacity-0', // Avoid scroll flickering on first render
          )}
        >
          {groupedMessages.map(renderMessage)}
        </div>

        {!chat.archived && (
          <ChatInputToolbar
            apps={apps}
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
            onSelectApp={onSelectApp}
          />
        )}
      </div>

      <ChatConfigPanel defaultValue={chat} />
    </div>
  );
});
