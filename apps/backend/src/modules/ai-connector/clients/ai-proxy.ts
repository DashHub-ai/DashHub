import type { taskEither as TE } from 'fp-ts';
import type { z } from 'zod';

import type { SdkAIModelT, SdkCreateMessageInputT, SdkMessageRoleT, SdkMessageT, SdkTableRowWithIdT } from '@llm/sdk';
import type { SearchEnginesService } from '~/modules/search-engines';
import type { SearchEngineResultItem } from '~/modules/search-engines/clients/search-engine-proxy';

import type { AIConnectionCreatorError } from '../ai-connector.errors';

export abstract class AIProxy {
  constructor(
    protected readonly aiModel: SdkAIModelT,
    protected readonly searchEnginesService: SearchEnginesService,
  ) {}

  protected get credentials() {
    return this.aiModel.credentials;
  }

  abstract executeEmbeddingPrompt(
    input: string
  ): TE.TaskEither<AIConnectionCreatorError, number[]>;

  abstract executeStreamPrompt(
    attrs: AIProxyStreamPromptAttrs
  ): TE.TaskEither<AIConnectionCreatorError, AsyncIterableIterator<AIProxyStreamChunk>>;

  abstract executeInstructedPrompt<Z extends z.AnyZodObject>(
    attrs: AIProxyInstructedAttrs<Z>
  ): TE.TaskEither<AIConnectionCreatorError, z.infer<Z>>;

  abstract executePrompt(attrs: AIProxyPromptAttrs): TE.TaskEither<AIConnectionCreatorError, string>;
};

export type AIProxyStreamChunk = string | {
  webSearchResults: SearchEngineResultItem[];
};

export type AIProxyStreamPromptAttrs = {
  history: SdkMessageT[];
  organization: SdkTableRowWithIdT;
  message: SdkCreateMessageInputT;
  signal?: AbortSignal;
  context?: string;
  functions?: object[];
};

export type AIProxyInstructedAttrs<Z extends z.AnyZodObject> = {
  history?: SdkMessageT[];
  message: string;
  schema: Z;
};

export type AIProxyPromptAttrs = {
  history?: SdkMessageT[];
  message: AIProxyMessage | string;
};

export type AIProxyImageMessage = {
  text: string;
  imageUrl: string;
};

export type AIProxyMessage = {
  role: SdkMessageRoleT;
  content: string | AIProxyImageMessage;
};

export function isAIProxyImageMessage(message: AIProxyMessage | string): message is AIProxyMessage {
  return typeof message === 'object';
}
