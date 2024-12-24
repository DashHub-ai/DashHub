export function wrapEmbeddingWithInfo(
  {
    type,
    embedding,
    fileName,
  }: {
    type: string;
    embedding: string;
    fileName: string;
  },
): string {
  return [
    [
      'Embedding info:',
      `- File name: "${fileName}"`,
      `- Type: ${type}`,
      `- Name in the list of the files of the project: "${fileName}"`,
      `- This file is the part of the project and may refer to the other project files.`,
      `- This file may describe other files in project.`,
    ].join('\n'),

    'Fragment:',
    embedding,
  ].join('\n--\n');
}
