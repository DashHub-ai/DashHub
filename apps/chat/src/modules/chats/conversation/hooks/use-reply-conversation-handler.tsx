import { taskEither as TE } from 'fp-ts';
import { identity, pipe } from 'fp-ts/lib/function';

import { type Overwrite, timeoutTE, tryOrThrowTE } from '@llm/commons';
import { usePromiseOptimisticResponse } from '@llm/commons-front';
import {
  type SdkChatT,
  type SdkCreateMessageInputT,
  type SdKSearchMessagesOutputT,
  type SdkTableRowWithIdNameT,
  useSdkForLoggedIn,
} from '@llm/sdk';

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
  const { sdks } = useSdkForLoggedIn();
  const { createMessage, searchMessages } = sdks.dashboard.chats;

  const { streamAIResponse, createAIReplyObservable } = useAIResponseObservable({ chat });
  const { loading, result, optimisticUpdate } = usePromiseOptimisticResponse<OptimisticSearchMessagesOutputT>(
    {
      ...initialMessages,
      replyObservable: null,
    },
  );

  const createOptimisticResponse = useOptimisticResponseCreator();
  const onReply = optimisticUpdate({
    before: createAIReplyObservable,
    task: (
      replyObservable,
      { aiModel, content }: SdkCreateMessageInputT & { aiModel: SdkTableRowWithIdNameT; },
    ) => pipe(
      TE.Do,
      TE.bind('message', () => createMessage(chat.id, {
        content,
      })),
      TE.bindW('aiResponse', ({ message }) => pipe(
        TE.tryCatch(
          () => streamAIResponse({
            observable: replyObservable,
            aiModel,
            message,
          }),
          identity,
        ),
        TE.orElse((error) => {
          // Do not treat errors from aborting the request as actual errors
          if (error instanceof Error && error.name === 'AbortError') {
            // Let's wait a bit for indexing aborted message.
            return timeoutTE(1500);
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
      args: [{ content, aiModel }],
    }) => ({
      replyObservable,
      total: total + 1,
      items: [
        ...items,
        createOptimisticResponse.user({ content }),
        createOptimisticResponse.bot(aiModel, replyObservable),
      ],
    }),
  });

  return {
    replying: loading,
    messages: result,
    onReply,
  };
}
