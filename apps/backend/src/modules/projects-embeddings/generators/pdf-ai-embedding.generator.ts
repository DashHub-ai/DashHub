import { Buffer } from 'node:buffer';
import { readFile, unlink, writeFile } from 'node:fs/promises';
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
export class PdfAIEmbeddingGenerator implements AIEmbeddingGenerator {
  constructor(
    @inject(TextAIEmbeddingGenerator) private readonly textEmbeddingGenerator: TextAIEmbeddingGenerator,
  ) {}

  generate = (attrs: AIEmbeddingGenerateAttrs) => {
    return pipe(
      TE.tryCatch(
        async () => {
          const tmpFile = join(tmpdir(), `${v4()}.pdf`);
          const txtFile = `${tmpFile}.txt`;

          try {
            await writeFile(tmpFile, attrs.buffer);
            await execa('pdftotext', [tmpFile, txtFile]);

            const text = await readFile(txtFile, 'utf-8');

            return { text };
          }
          finally {
            await Promise.all([
              unlink(tmpFile).catch(() => {}),
              unlink(txtFile).catch(() => {}),
            ]);
          }
        },
        error => new AIEmbeddingGeneratorError(error),
      ),
      TE.chainW(result => this.textEmbeddingGenerator.generate({
        ...attrs,
        buffer: Buffer.from(result.text),
      })),
    );
  };
}
