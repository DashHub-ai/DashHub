import { v4 } from 'uuid';

import type { Overwrite } from '@llm/commons';

import {
  type SdkCreateMessageInputT,
  type SdkMessageT,
  type SdkTableRowWithIdNameT,
  useSdkForLoggedIn,
} from '@llm/sdk';

import type { AIStreamObservable } from './use-ai-response-observable';

export type OptimisticMessageOutputT = Overwrite<SdkMessageT, {
  content: string | AIStreamObservable;
}>;

export function useOptimisticResponseCreator() {
  const { session: { token } } = useSdkForLoggedIn();

  const createBaseMessageFields = (): Pick<
    OptimisticMessageOutputT,
    'id' | 'updatedAt' | 'createdAt'
  > => ({
    id: v4(),
    updatedAt: new Date(),
    createdAt: new Date(),
  });

  return {
    user: (message: SdkCreateMessageInputT): OptimisticMessageOutputT => ({
      ...createBaseMessageFields(),
      content: message.content,
      role: 'user',
      aiModel: null,
      repliedMessage: null,
      app: null,
      files: [],
      creator: {
        id: token.sub,
        email: token.email,
      },
    }),

    bot: (
      aiModel: SdkTableRowWithIdNameT,
      observable: AIStreamObservable,
    ): OptimisticMessageOutputT => ({
      ...createBaseMessageFields(),
      files: [],
      content: observable,
      role: 'assistant',
      aiModel,
      creator: null,
      repliedMessage: null,
      app: null,
    }),

    app: (app: SdkTableRowWithIdNameT): OptimisticMessageOutputT => ({
      ...createBaseMessageFields(),
      files: [],
      content: 'System message',
      role: 'assistant',
      creator: null,
      repliedMessage: null,
      aiModel: null,
      app,
    }),
  };
}

export function extractOptimisticMessageContent(
  message: Pick<OptimisticMessageOutputT, 'content'>,
): string {
  return typeof message.content === 'string'
    ? message.content
    : message.content.getSnapshot().content;
}
