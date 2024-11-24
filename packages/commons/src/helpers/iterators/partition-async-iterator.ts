export function partitionAsyncIterator<I>(predFn: (prev: I, item: I, acc: I[]) => boolean) {
  return async function* walker(iterator: AsyncIterableIterator<I>): AsyncIterableIterator<I[]> {
    let acc: I[] = [];

    for await (const item of iterator) {
      acc.push(item);

      if (acc.length && predFn(acc[acc.length - 1], item, acc)) {
        yield acc;
        acc = [];
      }
    }

    if (acc.length) {
      yield acc;
    }
  };
}
