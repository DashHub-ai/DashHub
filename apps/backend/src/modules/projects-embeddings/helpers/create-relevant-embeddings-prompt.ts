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
        '3. If responding as an app: DO NOT describe files, instead keep acting as the app would',
        '4. Focus on answering the user\'s question directly',
        '5. For translation requests: translate content directly',
        '6. ALWAYS cite your sources using footnotes for ANY information from embeddings',
        '7. Use footnote-style references at the end of your response, prefixed with [^1], [^2] etc.',
        '8. Keep footnotes short (one sentence) and include embedding ID',
        '9. Prefer direct answers but ALWAYS cite sources with footnotes',
        '10. If files were attached to the chat or previous messages - treat them with highest priority',
        '11. For attached files, provide more detailed analysis only if user asks for it',
        '12. When user asks about "attached files", "uploaded files", or similar:',
        '    - Focus ONLY on files that were actually attached in the current chat',
        '    - Use other embeddings only for additional context if relevant',
        '    - Make it clear which information comes from attached files vs other context',
        '13. Don\'t use ✅ or ❌ in responses unless the user uses them first',
      ]
    : [
        '1. Respond in the same language as the user\'s prompt',
        '2. Provide a general response without referencing any embeddings',
        '3. If the user asks about specific files or content, explain that no relevant content was found',
        '4. DO NOT suggest any file-related actions ([action:...]) - there are no files to act upon',
        '5. DO NOT create any buttons or actions related to file operations',
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
    'Footnote Style References:',
    '- ALWAYS add footnotes for ANY information taken from embeddings',
    '- Every piece of information from embeddings must have a citation',
    '- Format: [^1]: Fragment #embedding:123 contains configuration details.',
    '- Keep footnotes short and concise - one sentence maximum',
    '- Citations are mandatory - no exceptions',
    '- Example response structure:',
    '  Your main response here with mandatory embedding references.',
    '  ',
    '  [^1]: Fragment #embedding:123 shows the implementation.',
    '  [^2]: Image #embedding:456 contains the architecture diagram.',
    '',
    'When to Skip Citations:',
    '- Direct translations',
    '- Simple yes/no answers',
    '- When user hasn\'t specifically asked about sources',
    '- When explaining code behavior (unless asked about specific location)',
    '- When summarizing content (unless asked for sources)',
    '',
    'When to Include Citations (ALWAYS):',
    '- Any information from embeddings must be cited',
    '- Technical specifications and implementation details',
    '- Configuration settings and parameters',
    '- Code examples and explanations',
    '- File locations and paths',
    '- Architecture and design details',
    '- Documentation references',
    '',
    'Action Buttons Guidelines:',
    '- Add RELEVANT action buttons based on context',
    '- Buttons must be in user\'s language',
    '- Must be specific to content type and context',
    '- Format: [action:Label|Question about the content]',
  ].join('\n');
}
