import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import { tryOrThrowTE } from '@llm/commons';
import { usePromiseOptimisticResponse } from '@llm/commons-front';
import {
  type SdkChatT,
  type SdkCreateMessageInputT,
  type SdkRequestAIReplyInputT,
  type SdKSearchMessagesOutputT,
  useSdkForLoggedIn,
} from '@llm/sdk';

import { useOptimisticResponseCreator } from './use-optimistic-response-creator';

type Attrs = {
  chat: SdkChatT;
  initialMessages: SdKSearchMessagesOutputT;
};

export function useReplyConversationHandler({ initialMessages, chat }: Attrs) {
  const { sdks } = useSdkForLoggedIn();
  const { result: messages, optimisticUpdate } = usePromiseOptimisticResponse(initialMessages);

  const optimisticResponseCreator = useOptimisticResponseCreator();
  const onReply = optimisticUpdate({
    task: (value: SdkCreateMessageInputT & SdkRequestAIReplyInputT) => pipe(
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
      total: result.total + 1,
      items: [
        ...result.items,
        optimisticResponseCreator(value),
      ],
    }),
  });

  return {
    messages,
    onReply,
  };
}
