import { pipe } from 'fp-ts/lib/function';

import { mapAsyncIterator } from './map-async-iterator';

export function decodeTextAsyncStream(
  iterator: AsyncIterableIterator<Uint8Array>,
  encoding: string = 'utf-8',
): AsyncIterableIterator<string> {
  const decoder = new TextDecoder(encoding);

  return pipe(
    iterator,
    mapAsyncIterator((chunk: Uint8Array) => decoder.decode(chunk, {
      stream: true,
    })),
  );
}
