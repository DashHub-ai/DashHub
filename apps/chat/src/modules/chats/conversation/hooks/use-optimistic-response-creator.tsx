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

  const createOptimisticChat = () => ({
    id: v4(),
    creator: {
      id: -1,
      email: '',
      name: '',
    },
  });

  const createBaseMessageFields = (): Pick<
    OptimisticMessageOutputT,
    'id' | 'updatedAt' | 'createdAt'
  > => ({
    id: v4(),
    updatedAt: new Date(),
    createdAt: new Date(),
  });

  return {
    user: ({ content, files, webSearch }: SdkCreateMessageInputT): OptimisticMessageOutputT => ({
      ...createBaseMessageFields(),
      content,
      role: 'user',
      aiModel: null,
      chat: createOptimisticChat(),
      repliedMessage: null,
      app: null,
      files: (files ?? []).map(createOptimisticResponseFile),
      corrupted: false,
      asyncFunctionsResults: [],
      webSearch: {
        enabled: !!webSearch,
        results: [],
      },
      creator: {
        id: token.sub,
        email: token.email,
        name: token.name,
      },
    }),

    bot: (
      {
        aiModel,
        webSearch,
        observable,
      }: {
        aiModel: SdkTableRowWithIdNameT;
        observable: AIStreamObservable;
        webSearch: boolean;
      },
    ): OptimisticMessageOutputT => ({
      ...createBaseMessageFields(),
      files: [],
      content: observable,
      role: 'assistant',
      chat: createOptimisticChat(),
      aiModel,
      creator: null,
      repliedMessage: null,
      asyncFunctionsResults: [],
      corrupted: false,
      app: null,
      webSearch: {
        enabled: webSearch,
        results: [],
      },
    }),

    app: (app: SdkTableRowWithIdNameT): OptimisticMessageOutputT => ({
      ...createBaseMessageFields(),
      files: [],
      chat: createOptimisticChat(),
      content: 'System message',
      role: 'assistant',
      creator: null,
      asyncFunctionsResults: [],
      repliedMessage: null,
      aiModel: null,
      corrupted: false,
      app,
      webSearch: {
        enabled: false,
        results: [],
      },
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
