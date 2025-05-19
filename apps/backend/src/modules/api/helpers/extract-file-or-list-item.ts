import { taskEither as TE } from 'fp-ts';

import type { Nullable } from '@dashhub/commons';
import type { TableRowWithId } from '~/modules/database';

import { SdkInvalidFileFormatError, type SdkTableRowWithIdT } from '@dashhub/sdk';

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

export function extractFileOrListItemOrNilTE(file: Nullable<File | TableRowWithId>): TE.TaskEither<
  SdkInvalidFileFormatError,
  ExtractedFile | TableRowWithId | null
> {
  if (!file) {
    return TE.right(null);
  }

  if ('id' in file) {
    return TE.right(file);
  }

  return extractFileOrListItemTE(file);
}
