export function flatMapAsyncIterator<I, O>(map: (input: I, index: number) => O[]) {
  return async function* walker(iterator: AsyncIterableIterator<I>): AsyncIterableIterator<O> {
    let index = 0;

    for await (const item of iterator) {
      for (const subItem of map(item, index++)) {
        yield subItem;
      }
    }
  };
}
