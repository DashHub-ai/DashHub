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
    chunkFn: text => pipe(
      text.split('\n'),
      A.chunksOf(40),
      A.map(chunk => chunk.join('\n')),
    ),
  });
}
