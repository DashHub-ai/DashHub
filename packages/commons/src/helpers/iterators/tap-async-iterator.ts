import type { CanBePromise } from '~/types/can-be-promise.type';

export function tapAsyncIterator<I>(tap: (input: I) => CanBePromise<void>) {
  return async function* walker(
    iterator: AsyncIterableIterator<I>,
  ): AsyncIterableIterator<I> {
    for await (const item of iterator) {
      await tap(item);
      yield item;
    }
  };
}
