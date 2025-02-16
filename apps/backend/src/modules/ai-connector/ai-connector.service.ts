import type { z } from 'zod';

import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type { SdkSearchAIModelItemT, SdkTableRowWithIdT } from '@llm/sdk';

import type { AIProxyInstructedAttrs, AIProxyPromptAttrs, AIProxyStreamPromptAttrs } from './clients/ai-proxy';

import { AIModelsService } from '../ai-models';
import { SearchEnginesService } from '../search-engines';
import { getAIModelProxyForModel } from './clients';

@injectable()
export class AIConnectorService {
  constructor(
    @inject(AIModelsService) private readonly aiModelsService: AIModelsService,
    @inject(SearchEnginesService) private readonly searchEnginesService: SearchEnginesService,
  ) {}

  executeEmbeddingPrompt = ({ aiModel, input }: { aiModel: SdkTableRowWithIdT; input: string; }) =>
    pipe(
      this.aiModelsService.get(aiModel.id),
      TE.map(getAIModelProxyForModel(this.searchEnginesService)),
      TE.chainW(proxy => proxy.executeEmbeddingPrompt(input)),
    );

  executeStreamPrompt = (
    params: { aiModel: SdkTableRowWithIdT; } & AIProxyStreamPromptAttrs) =>
    pipe(
      this.aiModelsService.get(params.aiModel.id),
      TE.map(getAIModelProxyForModel(this.searchEnginesService)),
      TE.chainW(proxy => proxy.executeStreamPrompt(params)),
    );

  executePrompt = (
    { aiModel, ...rest }: {
      aiModel: SdkTableRowWithIdT | SdkSearchAIModelItemT;
    } & AIProxyPromptAttrs,
  ) =>
    pipe(
      'credentials' in aiModel
        ? TE.of(aiModel)
        : this.aiModelsService.get(aiModel.id),
      TE.map(getAIModelProxyForModel(this.searchEnginesService)),
      TE.chainW(proxy => proxy.executePrompt(rest)),
    );

  executeInstructedPrompt = <Z extends z.AnyZodObject>(
    { aiModel, ...rest }: {
      aiModel: SdkTableRowWithIdT | SdkSearchAIModelItemT;
    } & AIProxyInstructedAttrs<Z>,
  ) =>
    pipe(
      'credentials' in aiModel
        ? TE.of(aiModel)
        : this.aiModelsService.get(aiModel.id),
      TE.map(getAIModelProxyForModel(this.searchEnginesService)),
      TE.chainW(proxy => proxy.executeInstructedPrompt(rest)),
    );
}
