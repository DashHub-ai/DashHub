import { taskEither as TE } from 'fp-ts';
import { identity, pipe } from 'fp-ts/lib/function';

import { format, type Overwrite, timeoutTE, tryOrThrowTE } from '@llm/commons';
import { usePromiseOptimisticResponse } from '@llm/commons-front';
import {
  getSdkAppMentionInChat,
  type SdkChatT,
  type SdkCreateMessageInputT,
  type SdkRepliedMessageT,
  type SdKSearchMessagesOutputT,
  type SdkTableRowWithIdNameT,
  useSdkForLoggedIn,
} from '@llm/sdk';
import { useI18n } from '~/i18n';

import { type AIStreamObservable, useAIResponseObservable } from './use-ai-response-observable';
import {
  type OptimisticMessageOutputT,
  useOptimisticResponseCreator,
} from './use-optimistic-response-creator';

type Attrs = {
  chat: SdkChatT;
  initialMessages: SdKSearchMessagesOutputT;
};

type OptimisticSearchMessagesOutputT = Overwrite<SdKSearchMessagesOutputT, {
  items: OptimisticMessageOutputT[];
  replyObservable: AIStreamObservable | null;
}>;

export function useReplyConversationHandler({ initialMessages, chat }: Attrs) {
  const { prompts } = useI18n().pack.chat;
  const { sdks } = useSdkForLoggedIn();
  const { createMessage, searchMessages, attachApp } = sdks.dashboard.chats;

  const { streamAIReply, createAIReplyObservable } = useAIResponseObservable({ chat });
  const { loading, result, optimisticUpdate } = usePromiseOptimisticResponse<OptimisticSearchMessagesOutputT>(
    {
      ...initialMessages,
      replyObservable: null,
    },
  );

  const createOptimisticResponse = useOptimisticResponseCreator();

  /**
   * Sends a message and waits for the AI response.
   */
  const onReply = optimisticUpdate({
    before: createAIReplyObservable,
    task: (
      replyObservable,
      {
        aiModel,
        files,
        content,
        replyToMessage,
      }: Overwrite<SdkCreateMessageInputT, {
        aiModel: SdkTableRowWithIdNameT;
        replyToMessage?: SdkRepliedMessageT | null;
      }>,
    ) => pipe(
      TE.Do,
      TE.bind('createdMessage', () => createMessage(
        chat.id,
        {
          files,
          content,
          replyToMessage,
        },
      )),
      TE.bindW('aiResponse', ({ createdMessage }) => pipe(
        TE.tryCatch(
          () => streamAIReply({
            observable: replyObservable,
            message: createdMessage,
            aiModel,
          }),
          identity,
        ),
        TE.orElse((error) => {
          // Do not treat errors from aborting the request as actual errors
          if (error instanceof Error && error.name === 'AbortError') {
            // Let's wait a bit for indexing aborted message.
            return timeoutTE(500);
          }

          return TE.left(error);
        }),
      )),
      TE.bindW('messages', () => searchMessages(chat.id, {
        offset: 0,
        limit: 100,
        sort: 'createdAt:desc',
      })),
      TE.map(({ messages: { items, ...pagination } }) => ({
        replyObservable: null,
        ...pagination,
        items: items.toReversed(),
      })),
      tryOrThrowTE,
    )(),

    optimistic: ({
      before: replyObservable,
      result: { items, total },
      args: [{ content, aiModel, files, replyToMessage }],
    }) => ({
      replyObservable,
      total: total + 1,
      items: [
        ...items,
        {
          ...createOptimisticResponse.user({ content, files }),
          repliedMessage: replyToMessage || null,
        },
        createOptimisticResponse.bot(aiModel, replyObservable),
      ],
    }),
  });

  /**
   * Refreshes last message
   */
  const onRefreshAIResponse = optimisticUpdate({
    before: createAIReplyObservable,
    task: (
      replyObservable,
      { aiModel, message }: {
        aiModel: SdkTableRowWithIdNameT;
        message: SdkRepliedMessageT;
      },
    ) => pipe(
      TE.Do,
      TE.bindW('aiResponse', () => pipe(
        TE.tryCatch(
          () => streamAIReply({
            observable: replyObservable,
            message,
            aiModel,
          }),
          identity,
        ),
        TE.orElse((error) => {
          // Do not treat errors from aborting the request as actual errors
          if (error instanceof Error && error.name === 'AbortError') {
            // Let's wait a bit for indexing aborted message.
            return timeoutTE(500);
          }

          return TE.left(error);
        }),
      )),
      TE.bindW('messages', () => searchMessages(chat.id, {
        offset: 0,
        limit: 100,
        sort: 'createdAt:desc',
      })),
      TE.map(({ messages: { items, ...pagination } }) => ({
        replyObservable: null,
        ...pagination,
        items: items.toReversed(),
      })),
      tryOrThrowTE,
    )(),

    optimistic: ({
      before: replyObservable,
      result: { items, total },
      args: [{ aiModel, message }],
    }) => ({
      replyObservable,
      total: total + 1,
      items: [
        ...items,
        {
          ...createOptimisticResponse.bot(aiModel, replyObservable),
          repliedMessage: message,
        },
      ],
    }),
  });

  /**
   * Attaches an app to the chat
   */
  const onAttachApp = optimisticUpdate({
    before: ({ args: [{ app }] }) => ({
      replyObservable: createAIReplyObservable(),
      initialPrompt: format(prompts.explainApp, {
        mention: getSdkAppMentionInChat(app),
      }),
    }),
    task: (
      { initialPrompt, replyObservable },
      { aiModel, app }: {
        aiModel: SdkTableRowWithIdNameT;
        app: SdkTableRowWithIdNameT;
      },
    ) => pipe(
      TE.Do,
      TE.bind('attachApp', () => attachApp(chat.id, {
        app,
      })),
      TE.bind('message', () => createMessage(chat.id, {
        content: initialPrompt,
      })),
      TE.bindW('aiResponse', ({ message }) => pipe(
        TE.tryCatch(
          () => streamAIReply({
            observable: replyObservable,
            message,
            aiModel,
          }),
          identity,
        ),
        TE.orElse((error) => {
          // Do not treat errors from aborting the request as actual errors
          if (error instanceof Error && error.name === 'AbortError') {
            // Let's wait a bit for indexing aborted message.
            return timeoutTE(500);
          }

          return TE.left(error);
        }),
      )),
      TE.bindW('messages', () => searchMessages(chat.id, {
        offset: 0,
        limit: 100,
        sort: 'createdAt:desc',
      })),
      TE.map(({ messages: { items, ...pagination } }) => ({
        replyObservable: null,
        ...pagination,
        items: items.toReversed(),
      })),
      tryOrThrowTE,
    )(),

    optimistic: ({
      before: { initialPrompt, replyObservable },
      result: { items, total },
      args: [{ app, aiModel }],
    }) => ({
      replyObservable,
      total: total + 1,
      items: [
        ...items,
        createOptimisticResponse.app(app),
        createOptimisticResponse.user({ content: initialPrompt }),
        createOptimisticResponse.bot(aiModel, replyObservable),
      ],
    }),
  });

  return {
    replying: loading,
    messages: result,
    onReply,
    onRefreshAIResponse,
    onAttachApp,
  };
}
