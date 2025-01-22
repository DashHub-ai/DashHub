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
        '4. Consider and analyze ALL provided file fragments',
        '5. Search through ALL file types, including source code, documents, images (.png, .jpg, etc), presentations, and any other files',
        '6. MANDATORY: Never mention filenames directly in text - always use #embedding:<id> instead',
        '7. MANDATORY: Always consider image files in your search - they may contain crucial diagrams, screenshots or visual documentation',
        '8. MANDATORY: If files were attached to the chat or previous messages - treat them with highest priority',
        '9. MANDATORY: Always analyze attached files first before other context',
        '10. MANDATORY: For attached files, provide more detailed analysis unless user specifies otherwise',
        '11. Prefer to analyze latest attached files first but consider all attached files in the context',
        '12. When user asks about "attached files", "uploaded files", or similar:',
        '    - Focus ONLY on files that were actually attached in the current chat',
        '    - Use other embeddings only for additional context if relevant',
        '    - Always prioritize responses about attached files',
        '    - Make it clear which information comes from attached files vs other context',
        '13. The ✅ or ❌ characters were using in the text are for illustrative purposes only. Do not use them in your responses (unless the user uses them first)',
      ]
    : [
        '1. Respond in the same language as the user\'s prompt',
        '2. DO NOT USE OR REFERENCE ANY #embedding:<id> - they are not allowed when no relevant content is found',
        '3. DO NOT MAKE UP OR GUESS ANY #embedding:<id> references',
        '4. Provide a general response without referencing any embeddings',
        '5. If the user asks about specific files or content, explain that no relevant content was found',
        '6. CRITICAL: DO NOT suggest any file-related actions ([action:...]) - there are no files to act upon',
        '7. CRITICAL: DO NOT create any buttons or actions related to file operations, summaries, or content analysis',
      ];

  return [
    'User prompt:',
    message,
    '\n\n\n--\n',
    'Context (based on project files):',
    context,
    '\n\n\n--\n',
    'Embeddings usage requirements:',
    '\n--\n',
    'CRITICAL: EMBEDDINGS USAGE REQUIREMENTS',
    '1. NEVER use raw filenames - ALWAYS use #embedding:<id>',
    '2. EVERY reference MUST use #embedding:<id> format',
    '3. NO EXCEPTIONS - even in examples or short mentions',
    '4. NO EXCEPTIONS - when referencing content, always cite specific fragments using #embedding:<id> format',
    '5. When referencing content: Always say "fragment #embedding:<id>" or "according to fragment #embedding:<id>"',
    '6. For images only: Use "image #embedding:<id>" - no need to mention fragments',
    '7. If there are no relevant embeddings, tell the user that no relevant content was found. Do not mention random files if they are not relevant',
    '',
    'Core Instructions:',
    ...coreInstructions,
    '',
    'Text Format Rules:',
    '- ❌ WRONG: "In config.ts we see..."',
    '- ✅ CORRECT: "In fragment #embedding:123 we see..."',
    '- ❌ WRONG: "Check the utils folder"',
    '- ✅ CORRECT: "Fragment #embedding:456 shows utilities"',
    '- ❌ WRONG: "File #embedding:789 shows..."',
    '- ❌ WRONG: "According to file #embedding:789..."',
    '- ✅ CORRECT: "Fragment #embedding:789 shows..."',
    '- ✅ CORRECT for images only: "Image #embedding:789 shows..."',
    '',
    'List Guidelines:',
    '- Always refer to content as fragments: "Fragment #embedding:<id> shows..." but only for text, not images',
    '- Exception for images: "Image #embedding:<id> shows..."',
    '- Never include empty or meaningless items in lists',
    '- Each item must contain meaningful content',
    '- Remove or combine items that are too short or redundant',
    '- Ensure each item adds unique value',
    '',
    'Reference Format:',
    '- Text content: Always refer to fragments, not files',
    '- Images: Refer to them as images, not fragments',
    '- Direct quotes: "Fragment #embedding:<id> states: \'quoted text\'"',
    '- Paraphrasing: "Fragment #embedding:<id> explains that..."',
    '- Multiple fragments: Cite each fragment separately',
    '- Example text: "Fragment #embedding:<id> shows..."',
    '- Example image: "Image #embedding:<id> shows..."',
    '',
    'Response Guidelines:',
    '- Be concise and focused',
    '- For file queries: Provide file name and one-sentence description unless more details requested',
    '- If relevant file found: Suggest its potential usefulness',
    '- If context not relevant: Provide general response',
    '- If user uploads a file without asking about it: DO NOT comment on or describe the file',
    '- If files were attached: Give them priority in analysis and responses',
    '- For attached files: Provide more detailed insights unless explicitly asked not to',
    '- When mentioning files, add RELEVANT action buttons based on context:',
    '  CRITICAL: Button labels and actions:',
    '  - MUST be in user\'s language',
    '  - MUST be relevant to the content type and context',
    '  - MUST be specific to what would be useful for that content',
    '  - Format: [action:Label|Question about the content]',
    '  Examples (DO NOT COPY DIRECTLY - create contextual ones instead):',
    '  For English users - choose relevant actions like:',
    '    * Ask for summary of a long document',
    '    * Request key points from a meeting notes',
    '    * Ask about specific topics in the content',
    '    * Request related information',
    '  For Polish users - choose relevant actions like:',
    '    * Prośba o podsumowanie długiego dokumentu',
    '    * Pytanie o kluczowe punkty z notatek',
    '    * Pytanie o konkretne tematy w treści',
    '    * Prośba o powiązane informacje',
    '',
    'Note: Context is grouped by files for better codebase structure understanding.',
  ].join('\n');
}
