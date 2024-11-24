import { pipe } from 'fp-ts/lib/function';
import { useState } from 'react';

import { createStoreSubscriber, type StoreSubscriber, tryOrThrowTE } from '@llm/commons';
import { useRefSafeCallback } from '@llm/commons-front';
import {
  type SdkChatT,
  type SdkTableRowWithIdT,
  type SdkTableRowWithUuidT,
  useSdkForLoggedIn,
} from '@llm/sdk';

type AIStreamContent = {
  error: boolean;
  done: boolean;
  content: string;
};

type Attrs = {
  chat: SdkChatT;
};

export type AIStreamObservable = StoreSubscriber<AIStreamContent>;

export function useAIResponseObservable({ chat }: Attrs) {
  const { sdks } = useSdkForLoggedIn();
  const [aiReplyObservable, setAIReplyObservable] = useState<AIStreamObservable | null>(null);

  const resetAIReplyStream = () => {
    const newAIReplyObservable = createStoreSubscriber<AIStreamContent>({
      content: '',
      done: false,
      error: false,
    });

    setAIReplyObservable(newAIReplyObservable);
  };

  const streamAIResponse = useRefSafeCallback(async (aiModel: SdkTableRowWithIdT, message: SdkTableRowWithUuidT) => {
    if (!aiReplyObservable) {
      return;
    }

    const aiReply = await pipe(
      sdks.dashboard.chats.requestAIReply(chat.id, message.id, { aiModel }),
      tryOrThrowTE,
    )();

    try {
      for await (const message of aiReply) {
        const acc = aiReplyObservable.getSnapshot();

        aiReplyObservable.notify({
          ...acc,
          content: acc.content + message,
        });
      }
    }
    catch (err) {
      console.error(err);
      aiReplyObservable.notify({
        ...aiReplyObservable.getSnapshot(),
        error: true,
      });

      throw err;
    }
    finally {
      aiReplyObservable.notify({
        ...aiReplyObservable.getSnapshot(),
        done: true,
      });
    }
  });

  return {
    aiReplyObservable,
    streamAIResponse,
    resetAIReplyStream,
  };
}
