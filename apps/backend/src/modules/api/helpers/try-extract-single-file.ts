import { either as E, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { z } from 'zod';

import type { SdkInvalidFileFormatError } from '@dashhub/sdk';

import { tryParseUsingZodSchema } from '@dashhub/commons';
import { SdkInvalidRequestError } from '@dashhub/sdk';

import { type ExtractedFile, extractFileTE } from './extract-file';

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
    TE.chainW(({ file }) => extractFileTE(file)),
  );
}
