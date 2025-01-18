import { Buffer } from 'node:buffer';

import { taskEither as TE } from 'fp-ts';

import { SdkInvalidFileFormatError } from '@llm/sdk';

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
