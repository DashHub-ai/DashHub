import type { MatchingEmbedding } from './types';

export type GroupedEmbeddingsByFile = Record<string, {
  file: MatchingEmbedding['projectFile'];
  fragments: MatchingEmbedding[];
}>;

export function groupEmbeddingsByFile(embeddings: MatchingEmbedding[]): GroupedEmbeddingsByFile {
  return embeddings.reduce<GroupedEmbeddingsByFile>(
    (acc, embedding) => {
      const fileId = embedding.projectFile.id;

      if (!acc[fileId]) {
        acc[fileId] = {
          file: embedding.projectFile,
          fragments: [],
        };
      }

      acc[fileId].fragments.push(embedding);
      return acc;
    },
    Object.create({}),
  );
}
