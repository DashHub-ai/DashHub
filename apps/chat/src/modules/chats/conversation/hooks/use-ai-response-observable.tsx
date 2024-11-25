import { pipe } from 'fp-ts/lib/function';

import { createStoreSubscriber, type StoreSubscriber, tryOrThrowTE } from '@llm/commons';
import { useRefSafeCallback } from '@llm/commons-front';
import {
  type SdkChatT,
  type SdkTableRowWithIdT,
  type SdkTableRowWithUuidT,
  useSdkForLoggedIn,
} from '@llm/sdk';

export type AIStreamContent = {
  error: boolean;
  done: boolean;
  message: SdkTableRowWithUuidT | null;
  content: string;
};

export type AIStreamObservable = StoreSubscriber<AIStreamContent>;

type Attrs = {
  chat: SdkChatT;
};

export function useAIResponseObservable({ chat }: Attrs) {
  const { sdks } = useSdkForLoggedIn();

  const createAIReplyObservable = () => createStoreSubscriber<AIStreamContent>({
    content: '',
    message: null,
    done: false,
    error: false,
  });

  const streamAIResponse = useRefSafeCallback(async (
    {
      observable,
      aiModel,
      message,
    }: {
      observable: AIStreamObservable;
      aiModel: SdkTableRowWithIdT;
      message: SdkTableRowWithUuidT;
    },
  ) => {
    observable.notify({
      ...observable.getSnapshot(),
      content: '',
      message,
    });

    const aiReply = await pipe(
      sdks.dashboard.chats.requestAIReply(chat.id, message.id, { aiModel }),
      tryOrThrowTE,
    )();

    try {
      for await (const message of aiReply) {
        const acc = observable.getSnapshot();

        observable.notify({
          ...acc,
          content: acc.content + message,
        });
      }
    }
    catch (err) {
      console.error(err);
      observable.notify({
        ...observable.getSnapshot(),
        error: true,
      });

      throw err;
    }
    finally {
      observable.notify({
        ...observable.getSnapshot(),
        done: true,
      });
    }
  });

  return {
    createAIReplyObservable,
    streamAIResponse,
  };
}
