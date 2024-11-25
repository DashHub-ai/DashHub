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
    'id' | 'updatedAt' | 'createdAt' | 'repeats'
  > => ({
    id: v4(),
    updatedAt: new Date(),
    createdAt: new Date(),
    repeats: [],
  });

  return {
    user: (message: SdkCreateMessageInputT): OptimisticMessageOutputT => ({
      ...createBaseMessageFields(),
      content: message.content,
      role: 'user',
      aiModel: null,
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
      content: observable,
      role: 'assistant',
      aiModel,
      creator: null,
    }),
  };
}
