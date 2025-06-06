import { Buffer } from 'node:buffer';

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

  generate = (attrs: AIEmbeddingGenerateAttrs) => {
    const base64Image = typeof attrs.buffer === 'string'
      ? attrs.buffer
      : Buffer.from(attrs.buffer).toString('base64');

    return pipe(
      this.aiModelsService.getDefaultVision(attrs.aiModel.organization.id),
      TE.chainW(visionModel => pipe(
        this.aiConnectorService.executePrompt({
          aiModel: visionModel,
          message: {
            role: 'user',
            content: {
              imageUrl: `data:image/jpeg;base64,${base64Image}`,
              text:
                `Describe this image. Try to guess the language based on the file name: ${attrs.fileName}.`
                + `If you can't guess the language, just describe the image in English.`
                + `Add information that it some other documents may refer to this image. It\'s part of the project.`,
            },
          },
        }),
      )),
      TE.chainW(result => this.textEmbeddingGenerator.generate({
        ...attrs,
        buffer: result || '',
      })),
    );
  };
}
