import { taskEither as TE } from 'fp-ts';

import type { Nullable } from '@llm/commons';

import { SdkInvalidFileFormatError, type SdkTableRowWithIdT } from '@llm/sdk';

import { type ExtractedFile, extractFile } from './extract-file';

export async function extractFileOrListItem(file: File | SdkTableRowWithIdT): Promise<ExtractedFile | SdkTableRowWithIdT> {
  if (file instanceof File) {
    return extractFile(file);
  }

  return file;
};

export function extractFileOrListItemTE(file: File) {
  return TE.tryCatch(
    async () => extractFile(file),
    () => new SdkInvalidFileFormatError({
      name: file.name,
      mimeType: file.type,
    }),
  );
}

export function extractFileOrListItemOrNilTE(file: Nullable<File>): TE.TaskEither<
  SdkInvalidFileFormatError,
  ExtractedFile | null
> {
  if (!file) {
    return TE.right(null);
  }

  return extractFileOrListItemTE(file);
}
