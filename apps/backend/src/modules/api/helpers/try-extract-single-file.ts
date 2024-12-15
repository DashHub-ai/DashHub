import { Buffer } from 'node:buffer';

import { either as E, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { z } from 'zod';

import { tryParseUsingZodSchema } from '@llm/commons';
import { SdkInvalidFileFormatError, SdkInvalidRequestError } from '@llm/sdk';

export type ExtractedFile = {
  buffer: Buffer;
  mimeType: string;
};

export function tryExtractSingleFile(body: unknown): TE.TaskEither<
  SdkInvalidFileFormatError | SdkInvalidRequestError,
  ExtractedFile
> {
  return pipe(
    TE.fromEither(
      pipe(
        body,
        tryParseUsingZodSchema(z.object({
          file: z.instanceof(File),
        })),
        E.mapLeft(error => new SdkInvalidRequestError(error.context)),
      ),
    ),
    TE.chainW(({ file }) =>
      TE.tryCatch(
        async () => ({
          buffer: Buffer.from(await file.arrayBuffer()),
          mimeType: file.type,
        }),
        () => new SdkInvalidFileFormatError({}),
      ),
    ),
  );
}
