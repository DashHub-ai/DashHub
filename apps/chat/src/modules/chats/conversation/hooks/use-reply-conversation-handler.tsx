import { taskEither as TE } from 'fp-ts';
import { identity, pipe } from 'fp-ts/lib/function';

import { type Overwrite, tryOrThrowTE } from '@llm/commons';
import { usePromiseOptimisticResponse } from '@llm/commons-front';
import {
  type SdkChatT,
  type SdkCreateMessageInputT,
  type SdKSearchMessagesOutputT,
  type SdkTableRowWithIdNameT,
  useSdkForLoggedIn,
} from '@llm/sdk';

import { useAIResponseObservable } from './use-ai-response-observable';
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
}>;

export function useReplyConversationHandler({ initialMessages, chat }: Attrs) {
  const { sdks } = useSdkForLoggedIn();
  const { createMessage, searchMessages } = sdks.dashboard.chats;

  const { streamAIResponse, createAIReplyObservable } = useAIResponseObservable({ chat });
  const { loading, result, optimisticUpdate } = usePromiseOptimisticResponse<OptimisticSearchMessagesOutputT>(
    initialMessages,
  );

  const createOptimisticResponse = useOptimisticResponseCreator();
  const onReply = optimisticUpdate({
    before: createAIReplyObservable,
    task: (
      observable,
      { aiModel, content }: SdkCreateMessageInputT & { aiModel: SdkTableRowWithIdNameT; },
    ) => pipe(
      TE.Do,
      TE.bind('message', () => createMessage(chat.id, {
        content,
      })),
      TE.bind('aiResponse', ({ message }) => TE.tryCatch(
        () => streamAIResponse({
          observable,
          aiModel,
          message,
        }),
        identity,
      )),
      TE.bindW('messages', () => searchMessages(chat.id, {
        offset: 0,
        limit: 100,
        sort: 'createdAt:desc',
      })),
      TE.map(({ messages: { items, ...pagination } }) => ({
        ...pagination,
        items: [
          ...items.toReversed(),
        ],
      })),
      tryOrThrowTE,
    )(),

    optimistic: ({
      before: observable,
      result: { items, total },
      args: [{ content, aiModel }],
    }) => ({
      total: total + 1,
      items: [
        ...items,
        createOptimisticResponse.user({ content }),
        createOptimisticResponse.bot(aiModel, observable),
      ],
    }),
  });

  return {
    replying: loading,
    messages: result,
    onReply,
  };
}
