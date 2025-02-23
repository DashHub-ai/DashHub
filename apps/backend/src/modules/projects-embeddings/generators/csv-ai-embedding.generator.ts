import { array as A } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import {
  AIEmbeddingGenerateAttrs,
  AIEmbeddingGenerator,
} from './base';
import { TextAIEmbeddingGenerator } from './text-ai-embedding.generator';

@injectable()
export class CsvAIEmbeddingGenerator implements AIEmbeddingGenerator {
  constructor(
    @inject(TextAIEmbeddingGenerator) private readonly textEmbeddingGenerator: TextAIEmbeddingGenerator,
  ) {}

  generate = (attrs: Omit<AIEmbeddingGenerateAttrs, 'chunkFn'>) => this.textEmbeddingGenerator.generate({
    ...attrs,
    chunkFn: (text) => {
      const lines = text.split('\n');
      const header = lines[0];
      const dataLines = lines.slice(1);

      return pipe(
        dataLines,
        A.chunksOf(40),
        A.map(chunk => [header, ...chunk].join('\n')),
      );
    },
  });
}
