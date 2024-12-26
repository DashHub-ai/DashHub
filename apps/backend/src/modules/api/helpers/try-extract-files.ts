import { Buffer } from 'node:buffer';

import { either as E, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { z } from 'zod';

import { tryParseUsingZodSchema } from '@llm/commons';
import { SdkInvalidFileFormatError, SdkInvalidRequestError } from '@llm/sdk';

import type { ExtractedFile } from './try-extract-single-file';

export function tryExtractFiles<T extends z.ZodRawShape>(
  schema?: z.ZodObject<T>,
): (body: Record<string, any>) => TE.TaskEither<
  SdkInvalidFileFormatError | SdkInvalidRequestError,
  z.infer<z.ZodObject<T>> & { files: readonly ExtractedFile[]; }
  > {
  const baseSchema = z.object({});
  const finalSchema = schema
    ? baseSchema.merge(schema)
    : baseSchema;

  return (body: Record<string, any>) => pipe(
    TE.fromEither(
      pipe(
        body,
        tryParseUsingZodSchema(finalSchema),
        E.mapLeft(error => new SdkInvalidRequestError(error.context)),
      ),
    ),
    TE.chainW(parsedPayload => pipe(
      extractAllFilesFromObject(body),
      TE.traverseArray(file => (
        TE.tryCatch(
          async (): Promise<ExtractedFile> => ({
            buffer: Buffer.from(await file.arrayBuffer()),
            mimeType: file.type,
            fileName: file.name,
          }),
          () => new SdkInvalidFileFormatError({
            name: file.name,
            mimeType: file.type,
          }),
        )),
      ),
      TE.map(extractedFiles => ({
        ...parsedPayload as z.infer<z.ZodObject<T>>,
        files: extractedFiles,
      })),
    )),
  );
}

function extractAllFilesFromObject(obj: Record<string, any>) {
  return Object
    .values(obj)
    .filter(value => value instanceof File);
}
