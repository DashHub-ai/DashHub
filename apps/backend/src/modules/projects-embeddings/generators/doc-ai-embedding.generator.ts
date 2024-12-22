import { Buffer } from 'node:buffer';
import { unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { execa } from 'execa';
import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';
import { v4 } from 'uuid';

import {
  AIEmbeddingGenerateAttrs,
  AIEmbeddingGenerator,
  AIEmbeddingGeneratorError,
} from './base';
import { TextAIEmbeddingGenerator } from './text-ai-embedding.generator';

@injectable()
export class DocAIEmbeddingGenerator implements AIEmbeddingGenerator {
  constructor(
    @inject(TextAIEmbeddingGenerator) private readonly textEmbeddingGenerator: TextAIEmbeddingGenerator,
  ) {}

  generate = (attrs: AIEmbeddingGenerateAttrs) => pipe(
    TE.tryCatch(
      async () => {
        const tmpId = v4();
        const tmpDoc = join(tmpdir(), `${tmpId}.doc`);

        try {
          await writeFile(tmpDoc, attrs.buffer);
          const { stdout } = await execa('antiword', [tmpDoc]);
          return stdout;
        }
        finally {
          await unlink(tmpDoc).catch(() => {});
        }
      },
      error => new AIEmbeddingGeneratorError(error),
    ),
    TE.chainW(result => this.textEmbeddingGenerator.generate({
      ...attrs,
      buffer: Buffer.from(result),
    })),
  );
}
