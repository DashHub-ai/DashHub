import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import { SdkSearchAIModelItemT } from '@llm/sdk';
import { AIConnectorService } from '~/modules/ai-connector';
import { AIModelsService } from '~/modules/ai-models';

import {
  AIEmbeddingGenerateAttrs,
  AIEmbeddingGenerateTE,
  AIEmbeddingGenerator,
  AIEmbeddingResult,
} from './base';

type SplitTextOptions = {
  chunkSize?: number;
  overlap?: number;
};

@injectable()
export class TextAIEmbeddingGenerator implements AIEmbeddingGenerator {
  constructor(
    @inject(AIModelsService) private readonly aiModelsService: AIModelsService,
    @inject(AIConnectorService) private readonly aiConnectorService: AIConnectorService,
  ) {}

  generate = ({ buffer, aiModel }: AIEmbeddingGenerateAttrs): AIEmbeddingGenerateTE => {
    const text = buffer.toString('utf-8');
    const chunks = splitTextIntoChunks({
      text,
      chunkSize: 1000,
      overlap: 100,
    });

    return pipe(
      TE.sequenceArray([
        this.generateSummaryEmbedding(aiModel, text),
        ...chunks.map(chunk => this.generateChunkEmbedding(aiModel, chunk)),
      ]),
      TE.map(array => [...array]),
    );
  };

  private generateSummaryEmbedding = (aiModel: SdkSearchAIModelItemT, text: string) => pipe(
    this.aiModelsService.getDefault(aiModel.organization.id),
    TE.chainW(summarizeAiModel => pipe(
      TE.Do,
      TE.apS('summarized', this.aiConnectorService.executePrompt({
        aiModel: summarizeAiModel,
        message: `Summarize, max 3 sentences: ${text}.`,
      })),
      TE.apS('embedding', this.aiConnectorService.executeEmbeddingPrompt({
        aiModel,
        input: text,
      })),
    )),
    TE.map(({ embedding, summarized }): AIEmbeddingResult => ({
      metadata: {},
      text: summarized || '',
      vector: embedding,
      summary: true,
    })),
  );

  private generateChunkEmbedding = (aiModel: SdkSearchAIModelItemT, text: string) => pipe(
    TE.Do,
    TE.apS('embedding', this.aiConnectorService.executeEmbeddingPrompt({
      aiModel,
      input: text,
    })),
    TE.map(({ embedding }): AIEmbeddingResult => ({
      metadata: {},
      text,
      vector: embedding,
      summary: false,
    })),
  );
}

function splitTextIntoChunks(
  {
    text,
    chunkSize = 200,
    overlap = 100,
  }: { text: string; } & SplitTextOptions,
): string[] {
  const chunks: string[] = [];
  let startIndex = 0;
  const minChunkSize = Math.floor(chunkSize * 0.75); // Minimum chunk size is 75% of target size

  while (startIndex < text.length) {
    const remainingText = text.slice(startIndex);
    const chunk = remainingText.slice(0, chunkSize);

    // Find the last sentence boundary within our chunk size
    let breakPoint = chunk.length;
    if (startIndex + chunkSize < text.length) {
      // Look for sentence boundaries (., !, ?, \n)
      const sentenceEndings = [...chunk.matchAll(/[.!?\n]\s*/g)].map(m => m.index! + m[0].length);

      // Find the last valid sentence boundary that results in a chunk larger than minChunkSize
      for (let i = sentenceEndings.length - 1; i >= 0; i--) {
        if (sentenceEndings[i] >= minChunkSize) {
          breakPoint = sentenceEndings[i];
          break;
        }
      }

      // If no suitable sentence boundary found and chunk is bigger than minimum size,
      // fall back to space boundary
      if (breakPoint === chunk.length && chunk.length > minChunkSize) {
        const lastSpace = chunk.lastIndexOf(' ', chunkSize);
        if (lastSpace > minChunkSize) {
          breakPoint = lastSpace + 1;
        }
      }
    }

    chunks.push(text.slice(startIndex, startIndex + breakPoint));
    startIndex += Math.max(breakPoint - overlap, minChunkSize / 2); // Ensure we move forward by at least half the minimum chunk size
  }

  return chunks;
}
