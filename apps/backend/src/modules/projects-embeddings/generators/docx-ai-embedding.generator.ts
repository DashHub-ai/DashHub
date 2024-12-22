import { Buffer } from 'node:buffer';

import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { parseOfficeAsync } from 'officeparser';
import { inject, injectable } from 'tsyringe';

import {
  AIEmbeddingGenerateAttrs,
  AIEmbeddingGenerator,
  AIEmbeddingGeneratorError,
} from './base';
import { TextAIEmbeddingGenerator } from './text-ai-embedding.generator';

@injectable()
export class DocxAIEmbeddingGenerator implements AIEmbeddingGenerator {
  constructor(
    @inject(TextAIEmbeddingGenerator) private readonly textEmbeddingGenerator: TextAIEmbeddingGenerator,
  ) {}

  generate = (attrs: AIEmbeddingGenerateAttrs) => {
    return pipe(
      TE.tryCatch(
        async () => parseOfficeAsync(attrs.buffer),
        error => new AIEmbeddingGeneratorError(error),
      ),
      TE.chainW(text => this.textEmbeddingGenerator.generate({
        ...attrs,
        buffer: Buffer.from(text),
      })),
    );
  };
}
