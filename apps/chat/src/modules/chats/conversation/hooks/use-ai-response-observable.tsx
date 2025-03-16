import type { TaskEither } from 'fp-ts/lib/TaskEither';

import { pipe } from 'fp-ts/lib/function';

import { createStoreSubscriber, type StoreSubscriber, tryOrThrowTE } from '@llm/commons';
import { useRefSafeCallback } from '@llm/commons-front';
import {
  type SdkChatT,
  type SdkRequestAIReplyInputT,
  type SdkTableRowWithUuidT,
  useSdkForLoggedIn,
} from '@llm/sdk';
import { useI18n } from '~/i18n';

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

type StreamAIResponseAttrs = {
  task: TaskEither<unknown, AsyncIterableIterator<string>>;
  observable: AIStreamObservable;
  message: SdkTableRowWithUuidT;
};

export function useAIResponseObservable({ chat }: Attrs) {
  const { sdks } = useSdkForLoggedIn();
  const { lang } = useI18n();

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
      task,
      observable,
      message,
    }: StreamAIResponseAttrs,
  ) => {
    observable.notify({
      ...observable.getSnapshot(),
      content: '',
      message,
    });

    const aiReply = await pipe(task, tryOrThrowTE)();

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

  const streamAIReply = async (
    {
      aiModel,
      ...attrs
    }: Omit<StreamAIResponseAttrs, 'task'> & SdkRequestAIReplyInputT,
  ) => streamAIResponse({
    ...attrs,
    task: sdks.dashboard.chats.requestAIReply({
      abortController: attrs.observable.getSnapshot().abortController,
      chatId: chat.id,
      messageId: attrs.message.id,
      data: {
        preferredLanguageCode: lang,
        aiModel,
      },
    }),
  });

  return {
    createAIReplyObservable,
    streamAIReply,
  };
}
