export async function asyncIteratorToVoidPromise<I>(iterator: AsyncIterableIterator<I>): Promise<void> {
  for await (const _ of iterator) {
    /* nop */
  }
}
