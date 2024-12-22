import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import { AIConnectorService } from '~/modules/ai-connector';
import { AIModelsService } from '~/modules/ai-models';

import {
  AIEmbeddingGenerateAttrs,
  AIEmbeddingGenerator,
} from './base';
import { TextAIEmbeddingGenerator } from './text-ai-embedding.generator';

@injectable()
export class ImageAIEmbeddingGenerator implements AIEmbeddingGenerator {
  constructor(
    @inject(TextAIEmbeddingGenerator) private readonly textEmbeddingGenerator: TextAIEmbeddingGenerator,
    @inject(AIConnectorService) private readonly aiConnectorService: AIConnectorService,
    @inject(AIModelsService) private readonly aiModelsService: AIModelsService,
  ) {}

  generate = (attrs: AIEmbeddingGenerateAttrs) =>
    pipe(
      this.aiModelsService.getDefault(attrs.aiModel.organization.id),
      TE.chainW(ocrModel => pipe(
        this.aiConnectorService.executePrompt({
          aiModel: ocrModel,
          message: {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please provide a description of the image',
              },
              {
                type: 'image_url',
                image_url: {
                  url: attrs.fileUrl,
                },
              },
            ],
          },
        }),
      )),
      TE.chainW(result => this.textEmbeddingGenerator.generate({
        ...attrs,
        buffer: result || '',
      })),
    );
}
