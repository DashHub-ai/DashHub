import { Buffer } from 'node:buffer';
import { readFile, unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { extname, join } from 'node:path';

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
export class GnumericAIEmbeddingGenerator implements AIEmbeddingGenerator {
  constructor(
    @inject(TextAIEmbeddingGenerator) private readonly textEmbeddingGenerator: TextAIEmbeddingGenerator,
  ) {}

  generate = (attrs: AIEmbeddingGenerateAttrs) => pipe(
    TE.tryCatch(
      async () => {
        const tmpId = v4();
        const extension = extname(attrs.fileName).toLowerCase() || '.xls';
        const tmpDoc = join(tmpdir(), `${tmpId}${extension}`);
        const tmpCsv = join(tmpdir(), `${tmpId}.csv`);

        try {
          await writeFile(tmpDoc, attrs.buffer);
          await execa('ssconvert', [tmpDoc, tmpCsv]);

          return await readFile(tmpCsv, 'utf8');
        }
        finally {
          await Promise.all([
            unlink(tmpDoc).catch(() => {}),
            unlink(tmpCsv).catch(() => {}),
          ]);
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
