import type { taskEither as TE } from 'fp-ts';
import type { z } from 'zod';

import type { SdkAIModelT, SdkCreateMessageInputT, SdkMessageRoleT, SdkMessageT } from '@llm/sdk';

import type { AIConnectionCreatorError } from '../ai-connector.errors';

export abstract class AIProxy {
  constructor(
    protected readonly aiModel: SdkAIModelT,
  ) {}

  protected get credentials() {
    return this.aiModel.credentials;
  }

  abstract executeEmbeddingPrompt(
    input: string
  ): TE.TaskEither<AIConnectionCreatorError, number[]>;

  abstract executeStreamPrompt(
    attrs: AIProxyStreamPromptAttrs
  ): TE.TaskEither<AIConnectionCreatorError, AsyncIterableIterator<string>>;

  abstract executeInstructedPrompt<Z extends z.AnyZodObject>(
    attrs: AIProxyInstructedAttrs<Z>
  ): TE.TaskEither<AIConnectionCreatorError, z.infer<Z>>;

  abstract executePrompt(attrs: AIProxyPromptAttrs): TE.TaskEither<AIConnectionCreatorError, string>;
};

export type AIProxyStreamPromptAttrs = {
  history: SdkMessageT[];
  message?: SdkCreateMessageInputT;
  signal?: AbortSignal;
  context?: string;
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
