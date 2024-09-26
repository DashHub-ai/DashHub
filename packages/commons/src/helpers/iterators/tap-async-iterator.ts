import type { CanBePromise } from '~/types/can-be-promise.type';

export function tapAsyncIterator<I, O>(tap: (input: I) => CanBePromise<void>) {
  return async function* walker(
    iterator: AsyncIterableIterator<I>,
  ): AsyncIterableIterator<O> {
    for await (const item of iterator) {
      await tap(item);
    }
  };
}
