import type { EsMatchingProjectEmbedding } from '../elasticsearch';

import { groupEmbeddingsByFile } from './group-embeddings';

export function createRelevantEmbeddingsPrompt(
  message: string,
  embeddings: EsMatchingProjectEmbedding[],
): string {
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
    'CRITICAL: EMBEDDINGS USAGE REQUIREMENTS',
    '1. NEVER use raw filenames - ALWAYS use #embedding:<id>',
    '2. EVERY file reference MUST use #embedding:<id> format',
    '3. NO EXCEPTIONS - even in examples or short mentions',
    '4. NO EXCEPTIONS - mention the source of the information from Context using #embedding:<id> format. Always do that.',
    '',
    'Core Instructions:',
    '1. Respond in the same language as the user\'s message',
    '2. If message contains #app mention: MAINTAIN THE APP\'S PERSONALITY AND TONE throughout the response',
    '3. If responding as an app: DO NOT describe files, instead keep acting as the app would',
    '4. Consider and analyze ALL provided file fragments',
    '5. Search through ALL file types, including source code, documents, images (.png, .jpg, etc), presentations, and any other files',
    '6. MANDATORY: Never mention filenames directly in text - always use #embedding:<id> instead',
    '7. MANDATORY: Always consider image files in your search - they may contain crucial diagrams, screenshots or visual documentation',
    '8. MANDATORY: If files were attached to the chat or previous messages - treat them with highest priority',
    '9. MANDATORY: Always analyze attached files first before other context',
    '10. MANDATORY: For attached files, provide more detailed analysis unless user specifies otherwise',
    '',
    'Text Format Rules:',
    '- ❌ WRONG: "In config.ts we see..."',
    '- ✅ CORRECT: "In #embedding:123 we see..."',
    '- ❌ WRONG: "Check the utils folder"',
    '- ✅ CORRECT: "Check #embedding:456 which contains utilities"',
    '- ❌ WRONG: "[#embedding:789] shows..."',
    '- ❌ WRONG: "(#embedding:789) contains..."',
    '- ✅ CORRECT: "#embedding:789 shows..."',
    '',
    'List Guidelines:',
    '- When listing files, ALWAYS use #embedding:<id> for each file reference',
    '- Never include empty or meaningless items in lists',
    '- Each list item must contain meaningful content and proper file references',
    '- Remove or combine items that are too short or redundant',
    '- Ensure each item adds unique value',
    '',
    'Reference Format:',
    '- ALWAYS use #embedding:<id> instead of raw filenames in text',
    '- File references in lists: #embedding:<id>',
    '- Direct quotes: #embedding:<id> "quoted text"',
    '- Paraphrasing: #embedding:<id> explains that... or According to #embedding:<id>...',
    '- Multiple sources: Maintain proper #embedding:<id> prefixes for each source',
    '- Example: Instead of "in file.ts we see..." write "in #embedding:<id> we see..."',
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
