import { v4 } from 'uuid';

import type { Overwrite } from '@llm/commons';

import {
  type SdkCreateMessageInputT,
  type SdkMessageFileT,
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
    user: ({ content, files }: SdkCreateMessageInputT): OptimisticMessageOutputT => ({
      ...createBaseMessageFields(),
      content,
      role: 'user',
      aiModel: null,
      chat: { id: v4() },
      repliedMessage: null,
      app: null,
      files: (files ?? []).map(createOptimisticResponseFile),
      creator: {
        id: token.sub,
        email: token.email,
        name: token.name,
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
      chat: { id: v4() },
      aiModel,
      creator: null,
      repliedMessage: null,
      app: null,
    }),

    app: (app: SdkTableRowWithIdNameT): OptimisticMessageOutputT => ({
      ...createBaseMessageFields(),
      files: [],
      chat: { id: v4() },
      content: 'System message',
      role: 'assistant',
      creator: null,
      repliedMessage: null,
      aiModel: null,
      app,
    }),
  };
}

function createOptimisticResponseFile(file: File): SdkMessageFileT {
  return {
    id: Date.now() + Math.random(),
    resource: {
      bucket: {
        id: -1,
        name: 'temp',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      id: -1,
      name: file.name,
      publicUrl: URL.createObjectURL(file),
      type: 'other',
    },
  };
}

export function extractOptimisticMessageContent(
  message: Pick<OptimisticMessageOutputT, 'content'>,
): string {
  return typeof message.content === 'string'
    ? message.content
    : message.content.getSnapshot().content;
}
