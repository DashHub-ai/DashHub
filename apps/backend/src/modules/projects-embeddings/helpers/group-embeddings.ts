import type { EsMatchingProjectEmbedding } from '../elasticsearch';

export type GroupedEmbeddingsByFile = Record<string, {
  file: EsMatchingProjectEmbedding['projectFile'];
  fragments: EsMatchingProjectEmbedding[];
}>;

export function groupEmbeddingsByFile(embeddings: EsMatchingProjectEmbedding[]): GroupedEmbeddingsByFile {
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
