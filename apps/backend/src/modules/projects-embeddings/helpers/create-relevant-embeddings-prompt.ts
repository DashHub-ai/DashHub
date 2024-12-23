import type { EsMatchingProjectEmbedding } from '../elasticsearch';

import { groupEmbeddingsByFile } from './group-embeddings';

export function createRelevantEmbeddingsPrompt(message: string, embeddings: EsMatchingProjectEmbedding[]): string {
  const groupedEmbeddings = groupEmbeddingsByFile(embeddings);

  const fragmentsText = Object
    .values(groupedEmbeddings)
    .slice(0, 10)
    .map(({ file, fragments }) => [
      `File: ${file.name}`,
      'Content from this file (with embeddings identifiers):',
      fragments
        .slice(0, 10)
        .map(({ text, id }) => `#embedding:${id}\n${text}`)
        .join('\n--\n'),
    ].join('\n'))
    .join('\n\n==========\n\n');

  return [
    message,
    '\n\n\n--\n',
    'Context (based on project files):',
    fragmentsText,
    '\n--\n',
    'Please respond in the same language as the user\'s message above. '
    + 'Provide a response to the user\'s question utilizing ALL relevant context from above. '
    + 'You must consider and analyze ALL provided file fragments, not just the first matching one.\n'
    + 'When incorporating information from the context:\n'
    + ' - Each reference to different context parts must be prefixed with its #embedding:<id>\n'
    + ' - For direct quotes use: #embedding:<id> "quoted text"\n'
    + ' - For paraphrasing use: #embedding:<id> explains that... or According to #embedding:<id>...\n'
    + ' - When combining information from multiple sources, each source must be properly attributed\n'
    + ' - Make sure to maintain proper #embedding:<id> prefixes even when referencing multiple sources in the same sentence\n'
    + ' - You must analyze and reference ALL relevant fragments, not just the first one you find\n'
    + 'If the context is not relevant, provide a general response.\n'
    + 'Note: The context is grouped by project files for better understanding of the codebase structure.',
  ].join('\n');
}