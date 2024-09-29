import { pipe } from 'fp-ts/lib/function';

import { partitionAsyncIterator } from './partition-async-iterator';

export function createChunkAsyncIterator(chunkSize: number) {
  return <I>(iterator: AsyncIterableIterator<I>): AsyncIterableIterator<I[]> =>
    pipe(
      iterator,
      partitionAsyncIterator((_, __, acc) => acc.length >= chunkSize),
    );
}
