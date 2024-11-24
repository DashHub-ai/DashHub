import { taskEither as TE } from 'fp-ts';
import { identity, pipe } from 'fp-ts/lib/function';

import { tapTaskEither, tryOrThrowTE } from '@llm/commons';
import { usePromiseOptimisticResponse } from '@llm/commons-front';
import {
  type SdkChatT,
  type SdkCreateMessageInputT,
  type SdkRequestAIReplyInputT,
  type SdKSearchMessagesOutputT,
  useSdkForLoggedIn,
} from '@llm/sdk';

import { useAIResponseObservable } from './use-ai-response-observable';
import { useOptimisticResponseCreator } from './use-optimistic-response-creator';

type Attrs = {
  chat: SdkChatT;
  initialMessages: SdKSearchMessagesOutputT;
};

export function useReplyConversationHandler({ initialMessages, chat }: Attrs) {
  const { sdks } = useSdkForLoggedIn();
  const { createMessage, searchMessages } = sdks.dashboard.chats;

  const { result, optimisticUpdate } = usePromiseOptimisticResponse(initialMessages);
  const {
    aiReplyObservable,
    streamAIResponse,
    resetAIReplyStream,
  } = useAIResponseObservable({ chat });

  const optimisticResponseCreator = useOptimisticResponseCreator();
  const onReply = optimisticUpdate({
    task: ({ aiModel, content }: SdkCreateMessageInputT & SdkRequestAIReplyInputT) => pipe(
      TE.Do,
      tapTaskEither(resetAIReplyStream),
      TE.bind('message', () => createMessage(chat.id, {
        content,
      })),
      TE.bind('aiResponse', ({ message }) => TE.tryCatch(
        () => streamAIResponse(aiModel, message),
        identity,
      )),
      TE.bindW('messages', () => searchMessages(chat.id, {
        offset: 0,
        limit: 100,
        sort: 'createdAt:desc',
      })),
      TE.map(({ messages: { items, ...pagination } }) => ({
        ...pagination,
        items: items.toReversed(),
      })),
      tryOrThrowTE,
    )(),

    optimistic: ({ items, total }, value) => ({
      total: total + 1,
      items: [
        ...items,
        optimisticResponseCreator(value),
      ],
    }),
  });

  return {
    aiReplyObservable,
    messages: result,
    onReply,
  };
}
