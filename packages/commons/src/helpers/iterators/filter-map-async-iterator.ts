/**
 * Maps each item of an async iterator using the provided map function,
 * but only yields the result if it's not null or undefined.
 *
 * @param mapFn - A function that takes an item and returns a mapped value or null/undefined.
 * @returns An async generator function that takes an iterator and yields mapped, non-nullish values.
 */
export function filterMapAsyncIterator<I, O>(mapFn: (input: I) => O | null | undefined) {
  return async function* walker(iterator: AsyncIterableIterator<I>): AsyncIterableIterator<O> {
    for await (const item of iterator) {
      const mapped = mapFn(item);
      if (mapped !== null && mapped !== undefined) {
        yield mapped;
      }
    }
  };
}
