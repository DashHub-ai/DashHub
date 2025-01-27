import type { EsMatchingProjectEmbedding } from '../elasticsearch';

import { groupEmbeddingsByFile } from './group-embeddings';

export function createRelevantEmbeddingsPrompt(
  message: string,
  embeddings: EsMatchingProjectEmbedding[],
): string {
  const groupedEmbeddings = Object.values(groupEmbeddingsByFile(embeddings));
  let context = '';

  if (groupedEmbeddings.length) {
    context = groupedEmbeddings
      .slice(0, 10)
      .map(
        ({ file, fragments }) => [
          `File: ${file.name}`,
          'Content from this file (with embeddings identifiers):',
          fragments
            .slice(0, 10)
            .map(({ text, id }) => `Embedding(#embedding:${id})\nEmbedding content: ${text}`)
            .join('\n--\n'),
        ].join('\n'),
      )
      .join('\n\n==========\n\n');
  }
  else {
    context = 'No relevant content was found in the project files.';
  }

  const coreInstructions = groupedEmbeddings.length
    ? [
        '1. Respond in the same language as the user\'s prompt',
        '2. If message contains #app mention: MAINTAIN THE APP\'S PERSONALITY AND TONE throughout the response',
        '3. Provide natural, conversational responses while incorporating relevant context when appropriate',
        '4. Focus on answering the user\'s question directly and clearly',
        '5. For translation requests: translate content directly without additional commentary',
        '6. Use available context to enhance your response, but don\'t force references if not relevant',
        '7. When using information from files:',
        '    - First mention: cite source using footnote [^1] and provide detailed explanation',
        '    - Subsequent mentions: refer back to earlier explanation without repeating the source',
        '    - Only cite new, unique information from files',
        '8. Keep footnotes short (one sentence) and include embedding ID when citing sources',
        '9. When user specifically asks about files or content:',
        '    - Prioritize information from attached files in the current chat',
        '    - Use other available context to provide comprehensive answers',
        '    - Make it clear which information comes from files vs general knowledge',
        '10. Don\'t use ✅ or ❌ in responses unless the user uses them first',
      ]
    : [
        '1. Respond in the same language as the user\'s prompt',
        '2. Provide a natural, conversational response',
        '3. If the user specifically asks about files or content, explain that no relevant content was found',
        '4. Offer helpful general information or suggestions when appropriate',
        '5. Focus on being helpful while staying within your knowledge boundaries',
      ];

  return [
    'User prompt:',
    message,
    '\n\n\n--\n',
    'Context (based on project files):',
    context,
    '\n\n\n--\n',
    'Response Guidelines:',
    ...coreInstructions,
    '',
    'Citation Guidelines:',
    '- Add footnotes only for first mention of specific information',
    '- Format: [^1]: Fragment #embedding:123 contains relevant details.',
    '- Keep references natural and only when meaningful',
    '- For repeated information, refer to previous explanation without new citation',
    '- Citations are optional unless specifically referencing new file content',
    '',
    'When to Skip Citations:',
    '- General knowledge responses',
    '- Direct translations',
    '- Simple yes/no answers',
    '- Conceptual explanations',
    '- When user hasn\'t asked about sources',
    '',
    'When to Include Citations:',
    '- When directly quoting or referencing file content',
    '- When answering specific questions about files',
    '- When providing technical details from documentation',
    '- When user asks for source information',
  ].join('\n');
}
