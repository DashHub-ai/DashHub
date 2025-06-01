import { Buffer } from 'node:buffer';

import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import { SdkInvalidFileFormatError } from '@dashhub/sdk';

import { fetchAsFileTE } from './fetch-as-file';

export type ExtractedFile = {
  buffer: Buffer;
  mimeType: string;
  fileName: string;
};

export async function extractFile(file: File): Promise<ExtractedFile> {
  return {
    buffer: Buffer.from(await file.arrayBuffer()),
    mimeType: file.type,
    fileName: file.name,
  };
};

export function extractFileTE(file: File) {
  return TE.tryCatch(
    async () => extractFile(file),
    () => new SdkInvalidFileFormatError({
      name: file.name,
      mimeType: file.type,
    }),
  );
}

export function fetchAndExtractFileTE(url: string) {
  return pipe(
    fetchAsFileTE(url),
    TE.chainW(extractFileTE),
  );
}
