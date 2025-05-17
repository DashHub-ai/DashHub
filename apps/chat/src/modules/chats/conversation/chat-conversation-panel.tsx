import clsx from 'clsx';
import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import {
  memo,
  type RefObject,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { findItemById, type Nullable, rejectFalsyItems, runTask } from '@dashhub/commons';
import { useAfterMount, useInterval, useRefSafeCallback } from '@dashhub/commons-front';
import {
  getLastUsedSdkMessagesAIModel,
  groupSdkAIMessagesByRepeats,
  type SdkChatT,
  type SdkSearchMessagesOutputT,
  type SdkTableRowWithIdNameT,
  useSdkForLoggedIn,
} from '@dashhub/sdk';
import { useWorkspaceOrganizationOrThrow } from '~/modules/workspace';

import type { SdkRepeatedMessageItemT } from './messages/chat-message';

import { ChatAttachedApp } from './chat-attached-app';
import {
  extractOptimisticMessageContent,
  useAutoFocusConversationInput,
  useReplyConversationHandler,
  useScrollFlickeringIndicator,
  useSendInitialMessage,
} from './hooks';
import {
  ChatInputToolbar,
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
};

export const ChatConversationPanel = memo((
  {
    ref,
    chat,
    initialMessages,
    className,
    replyAfterMount,
  }: Props,
) => {
  const { createRecordGuard, sdks } = useSdkForLoggedIn();
  const { can } = createRecordGuard(chat);
  const { organization } = useWorkspaceOrganizationOrThrow();

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

  const [hasDefaultWebSearch, setDefaultWebSearch] = useState(
    () => messages.items[messages.items.length - 1]?.webSearch?.enabled ?? false,
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

  const onSendChatMessage = useRefSafeCallback((message: ChatInputValue) => {
    setReplyToMessage(null);

    return pipe(
      aiModel
        ? TE.of(aiModel)
        : sdks.dashboard.aiModels.getDefault(organization.id),
      TE.chainW(defaultAiModel => TE.tryCatch(
        async () => onReply({
          ...message,
          replyToMessage: replyToMessage && {
            ...replyToMessage,
            content: extractOptimisticMessageContent(replyToMessage),
          },
          aiModel: defaultAiModel,
        }),
        TE.left,
      )),
      runTask,
    );
  });

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
    const isLast = index === groupedMessages.length - 1;

    if (message.app) {
      return (
        <ChatAttachedApp
          key={index}
          app={message.app}
          showPrompts={isLast}
          onSendChatMessage={onSendChatMessage}
        />
      );
    }

    return (
      <ChatMessage
        key={index}
        message={message}
        isLast={isLast}
        readOnly={!can.write || chat.archived}
        archived={chat.archived}
        onRefreshResponse={onRefreshResponse}
        onReply={setReplyToMessage}
        onAction={onAction}
      />
    );
  };

  useSendInitialMessage((initialMessage) => {
    setDefaultWebSearch(!!initialMessage?.webSearch);
    void onReply(initialMessage);
  });

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

    let enforceScroll = true;

    return messages.replyObservable.subscribe(() => {
      scrollConversation(enforceScroll);
      enforceScroll = false;
    });
  }, [messages.replyObservable]);

  return (
    <div
      ref={ref}
      className={clsx(
        'relative flex flex-col flex-1',
        className,
      )}
    >
      <div
        ref={messagesContainerRef}
        className={clsx(
          '[&::-webkit-scrollbar]:hidden',
          '[-ms-overflow-style:none]',
          'overflow-y-scroll',
          '[scrollbar-width:none]',
          'h-full',
        )}
      >
        <div
          className={clsx(
            'z-10 relative flex-1 m-auto w-full max-w-[800px]',

            // Avoid scroll flickering on first render
            flickeringIndicator.visible
              ? 'opacity-100'
              : 'opacity-0',

            // Magic CSS class for preview indicators
            'chat-conversation-panel',
          )}
          onLoad={() => scrollConversation()}
        >
          {groupedMessages.map(renderMessage)}
        </div>
      </div>

      {can.write && !chat.archived && (
        <ChatInputToolbar
          apps={apps}
          replyToMessage={replyToMessage}
          replying={replying}
          inputRef={inputRef}
          defaultValue={{
            webSearch: hasDefaultWebSearch,
          }}
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
