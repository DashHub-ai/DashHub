import clsx from 'clsx';
import {
  memo,
  type RefObject,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { findItemById, type Nullable, rejectFalsyItems } from '@llm/commons';
import { useAfterMount, useInterval } from '@llm/commons-front';
import {
  getLastUsedSdkMessagesAIModel,
  groupSdkAIMessagesByRepeats,
  type SdkChatT,
  type SdkSearchMessagesOutputT,
  type SdkTableRowWithIdNameT,
  useSdkForLoggedIn,
} from '@llm/sdk';

import type { SdkRepeatedMessageItemT } from './messages/chat-message';

import { ChatAttachedApp } from './chat-attached-app';
import { type ChatBackdropSettings, ChatBackground } from './chat-background';
import {
  extractOptimisticMessageContent,
  useAutoFocusConversationInput,
  useReplyConversationHandler,
  useScrollFlickeringIndicator,
  useSendInitialMessage,
} from './hooks';
import {
  ChatInputToolbar,
  type ChatInputToolbarProps,
  type ChatInputValue,
} from './input-toolbar';
import { ChatMessage } from './messages/chat-message';

type Props = {
  ref?: RefObject<HTMLDivElement | null>;
  chat: SdkChatT;
  initialMessages?: SdkSearchMessagesOutputT;
  replyAfterMount?: {
    app?: Nullable<SdkTableRowWithIdNameT>;
    content?: Nullable<string>;
    aiModel: SdkTableRowWithIdNameT;
  };
  className?: string;
  inputToolbarProps?: Pick<ChatInputToolbarProps, 'expanded' | 'rounded'>;
  backdropSettings?: ChatBackdropSettings;
};

export const ChatConversationPanel = memo((
  {
    ref,
    chat,
    inputToolbarProps,
    initialMessages,
    className,
    backdropSettings,
    replyAfterMount,
  }: Props,
) => {
  const { can } = useSdkForLoggedIn().createRecordGuard(chat);
  const flickeringIndicator = useScrollFlickeringIndicator();
  const sentInitialMessageRef = useRef(false);
  const {
    inputRef,
    messagesContainerRef,
    focusInput,
    scrollConversation,
  } = useAutoFocusConversationInput();

  const [replyToMessage, setReplyToMessage] = useState<SdkRepeatedMessageItemT | null>(null);
  const { messages, replying, onReply, onRefreshAIResponse, onAttachApp } = useReplyConversationHandler({
    chat,
    initialMessages: {
      items: [],
      total: 0,
      ...initialMessages,
    },
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

  const onAction = async (action: string) => {
    await onSendChatMessage({
      content: action,
    });
  };

  const onSelectApp = async (app: SdkTableRowWithIdNameT) => {
    if (!findItemById(app.id)(apps)) {
      await onAttachApp(app);
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
        readOnly={!can.write || chat.archived}
        archived={chat.archived}
        onRefreshResponse={onRefreshResponse}
        onReply={setReplyToMessage}
        onAction={onAction}
      />
    );
  };

  useSendInitialMessage(onReply);
  useLayoutEffect(focusInput, [messages, replyToMessage]);
  useInterval(focusInput, 1, { maxTicks: 50 });

  useAfterMount(() => {
    if (replyAfterMount && !sentInitialMessageRef.current) {
      sentInitialMessageRef.current = true;

      void (async () => {
        if (replyAfterMount.app) {
          await onAttachApp(replyAfterMount.app);
        }

        if (replyAfterMount.content) {
          await onReply({
            aiModel: replyAfterMount.aiModel,
            content: replyAfterMount.content,
          });
        }
      })();
    }
  });

  useEffect(() => {
    if (!messages.replyObservable) {
      return;
    }

    return messages.replyObservable.subscribe(scrollConversation);
  }, [messages.replyObservable]);

  return (
    <div
      ref={ref}
      className={clsx('relative flex flex-col flex-1', className)}
    >
      <ChatBackground {...backdropSettings} />

      <div
        ref={messagesContainerRef}
        className={clsx(
          'relative z-10 flex-1 [&::-webkit-scrollbar]:hidden p-4 [-ms-overflow-style:none] overflow-y-scroll [scrollbar-width:none]',

          // Avoid scroll flickering on first render
          flickeringIndicator.visible
            ? 'opacity-100'
            : 'opacity-0',
        )}
        onLoad={scrollConversation}
      >
        {groupedMessages.map(renderMessage)}
      </div>

      {can.write && !chat.archived && (
        <ChatInputToolbar
          {...inputToolbarProps}
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
  );
});
