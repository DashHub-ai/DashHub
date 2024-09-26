export function mapAsyncIterator<I, O>(map: (input: I) => O) {
  return async function* walker(
    iterator: AsyncIterableIterator<I>,
  ): AsyncIterableIterator<O> {
    for await (const item of iterator) {
      yield map(item);
    }
  };
}
