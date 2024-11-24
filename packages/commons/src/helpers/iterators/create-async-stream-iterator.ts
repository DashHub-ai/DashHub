export async function* createAsyncStreamIterator(
  reader: ReadableStreamDefaultReader<any>,
): AsyncIterableIterator<any> {
  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    yield value;
  }
}
