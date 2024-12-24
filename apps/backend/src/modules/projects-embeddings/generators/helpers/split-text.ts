export type SplitTextOptions = {
  chunkSize?: number;
  overlap?: number;
};

export function splitTextIntoChunks(
  {
    text,
    chunkSize = 200,
    overlap = 100,
  }: { text: string; } & SplitTextOptions,
): string[] {
  const chunks: string[] = [];
  let startIndex = 0;
  const minChunkSize = Math.floor(chunkSize * 0.75);

  while (startIndex < text.length) {
    const remainingText = text.slice(startIndex);
    const chunk = remainingText.slice(0, chunkSize);

    let breakPoint = chunk.length;
    if (startIndex + chunkSize < text.length) {
      const sentenceEndings = [...chunk.matchAll(/[.!?\n]\s*/g)].map(m => m.index! + m[0].length);

      for (let i = sentenceEndings.length - 1; i >= 0; i--) {
        if (sentenceEndings[i] >= minChunkSize) {
          breakPoint = sentenceEndings[i];
          break;
        }
      }

      if (breakPoint === chunk.length && chunk.length > minChunkSize) {
        const lastSpace = chunk.lastIndexOf(' ', chunkSize);
        if (lastSpace > minChunkSize) {
          breakPoint = lastSpace + 1;
        }
      }
    }

    chunks.push(text.slice(startIndex, startIndex + breakPoint));
    startIndex += Math.max(breakPoint - overlap, minChunkSize / 2);
  }

  return chunks;
}
