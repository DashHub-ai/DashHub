import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import { SdkSearchAIModelItemT } from '@llm/sdk';
import { AIConnectorService } from '~/modules/ai-connector';
import { AIModelsService } from '~/modules/ai-models';

import {
  AIEmbeddingGenerateAttrs,
  AIEmbeddingGenerator,
  AIEmbeddingGeneratorError,
  AIEmbeddingResult,
} from './base';
import {
  describeEmbeddingType,
  splitTextIntoChunks,
  wrapEmbeddingWithInfo,
} from './helpers';

@injectable()
export class TextAIEmbeddingGenerator implements AIEmbeddingGenerator {
  constructor(
    @inject(AIModelsService) private readonly aiModelsService: AIModelsService,
    @inject(AIConnectorService) private readonly aiConnectorService: AIConnectorService,
  ) {}

  generate = ({ buffer, aiModel, fileName, fileUrl }: AIEmbeddingGenerateAttrs) => {
    const text = buffer.toString('utf-8');
    const chunks = splitTextIntoChunks({
      text,
      chunkSize: 1000,
      overlap: 100,
    });

    return pipe(
      TE.sequenceArray([
        this.generateSummaryEmbedding({ aiModel, text, fileName }),
        ...chunks.map(chunk => this.generateChunkEmbedding({
          aiModel,
          chunk,
          fileName,
          fileUrl,
        })),
      ]),
      TE.map(array => [...array]),
      TE.mapLeft(error => new AIEmbeddingGeneratorError(error)),
    );
  };

  private generateSummaryEmbedding = (
    {
      aiModel,
      text,
      fileName,
    }: {
      aiModel: SdkSearchAIModelItemT;
      text: string;
      fileName: string;
    },
  ) => pipe(
    this.aiModelsService.getDefault(aiModel.organization.id),
    TE.chainW(summarizeAiModel => pipe(
      TE.Do,
      TE.apS('summarized', this.aiConnectorService.executePrompt({
        aiModel: summarizeAiModel,
        message: `Summarize, max 3 sentences: ${text}.`,
      })),
      TE.apS('embedding', this.aiConnectorService.executeEmbeddingPrompt({
        aiModel,
        input: wrapEmbeddingWithInfo({
          type: 'summary',
          embedding: text.slice(0, 30_000),
          fileName,
        }),
      })),
    )),
    TE.map(({ embedding, summarized }): AIEmbeddingResult => ({
      metadata: {},
      text: summarized || '',
      vector: embedding,
      summary: true,
    })),
  );

  private generateChunkEmbedding = (
    {
      aiModel,
      chunk,
      fileName,
      fileUrl,
    }: {
      aiModel: SdkSearchAIModelItemT;
      chunk: string;
      fileName: string;
      fileUrl: string;
    },
  ) => pipe(
    TE.Do,
    TE.apS('embedding', this.aiConnectorService.executeEmbeddingPrompt({
      aiModel,
      input: wrapEmbeddingWithInfo({
        type: describeEmbeddingType(fileUrl),
        embedding: chunk,
        fileName,
      }),
    })),
    TE.map(({ embedding }): AIEmbeddingResult => ({
      metadata: {},
      text: chunk,
      vector: embedding,
      summary: false,
    })),
  );
}
