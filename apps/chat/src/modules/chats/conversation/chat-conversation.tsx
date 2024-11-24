import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { useLayoutEffect, useRef } from 'react';

import { tryOrThrowTE } from '@llm/commons';
import { useAfterMount, usePromiseOptimisticResponse } from '@llm/commons-front';
import {
  type SdkChatT,
  type SdkCreateMessageInputT,
  type SdKSearchMessagesOutputT,
  useSdkForLoggedIn,
} from '@llm/sdk';

import { ChatBackground } from './chat-background';
import { ChatConfigPanel } from './config-panel';
import { useOptimisticResponseCreator } from './hooks';
import { ChatInputToolbar } from './input-toolbar';
import { ChatMessage } from './messages/chat-message';

type Props = {
  chat: SdkChatT;
  initialMessages: SdKSearchMessagesOutputT;
};

export function ChatConversation({ chat, initialMessages }: Props) {
  const { sdks } = useSdkForLoggedIn();
  const {
    result: messages,
    optimisticUpdate,
  } = usePromiseOptimisticResponse(initialMessages);

  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const optimisticResponseCreator = useOptimisticResponseCreator();
  const onReply = optimisticUpdate({
    task: (value: SdkCreateMessageInputT) => pipe(
      sdks.dashboard.chats.createMessage(chat.id, value),
      TE.chain(() => sdks.dashboard.chats.searchMessages(chat.id, {
        offset: 0,
        limit: 100,
        sort: 'createdAt:desc',
      })),
      TE.map(({ items, ...pagination }) => ({
        ...pagination,
        items: items.toReversed(),
      })),
      tryOrThrowTE,
    )(),

    optimistic: (result, value) => ({
      ...result,
      items: [
        ...result.items,
        optimisticResponseCreator(value),
      ],
    }),
  });

  const focusInput = () => {
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });

    inputRef.current?.focus();
  };

  useAfterMount(focusInput);
  useLayoutEffect(focusInput, [messages]);

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
          <ChatInputToolbar inputRef={inputRef} onSubmit={onReply} />
        )}
      </div>

      <ChatConfigPanel defaultValue={chat} />
    </div>
  );
}
