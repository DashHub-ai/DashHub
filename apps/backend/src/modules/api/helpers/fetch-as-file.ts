import { taskEither as TE } from 'fp-ts';

import { dropSearchParams, TaggedError } from '@dashhub/commons';

export async function fetchAsFile(url: string): Promise<File> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch file from ${url}: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const contentType = response.headers.get('content-type') || 'application/octet-stream';
  const fileName = dropSearchParams(url).split('/').pop() || 'downloaded-file';

  return new File([arrayBuffer], fileName, { type: contentType });
}

export function fetchAsFileTE(url: string) {
  return TE.tryCatch(
    () => fetchAsFile(url),
    error => new FetchAsFileError(error),
  );
}

export class FetchAsFileError extends TaggedError.ofLiteral<any>()('FetchAsFileError') {}
