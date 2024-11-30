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
  abortController: AbortController;
};

export type AIStreamObservable = StoreSubscriber<AIStreamContent> & {
  abort: VoidFunction;
};

type Attrs = {
  chat: SdkChatT;
};

export function useAIResponseObservable({ chat }: Attrs) {
  const { sdks } = useSdkForLoggedIn();

  const createAIReplyObservable = (): AIStreamObservable => {
    const abortController = new AbortController();
    const store = createStoreSubscriber<AIStreamContent>({
      content: '',
      message: null,
      done: false,
      error: false,
      abortController,
    });

    return {
      ...store,
      abort: () => {
        try {
          abortController.abort();
        }
        // eslint-disable-next-line unused-imports/no-unused-vars
        catch (_: any) {}
      },
    };
  };

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
      sdks.dashboard.chats.requestAIReply({
        abortController: observable.getSnapshot().abortController,
        chatId: chat.id,
        messageId: message.id,
        data: { aiModel },
      }),
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
