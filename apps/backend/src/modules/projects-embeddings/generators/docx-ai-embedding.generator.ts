import { Buffer } from 'node:buffer';

import Docxtemplater from 'docxtemplater';
import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import PizZip from 'pizzip';
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
        async () => {
          const zip = new PizZip(attrs.buffer);
          const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
          });

          return doc.getFullText();
        },
        error => new AIEmbeddingGeneratorError(error),
      ),
      TE.chainW(text => this.textEmbeddingGenerator.generate({
        ...attrs,
        buffer: Buffer.from(text),
      })),
    );
  };
}
