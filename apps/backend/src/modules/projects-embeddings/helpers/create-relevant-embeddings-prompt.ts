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
    'CRITICAL: EMBEDDINGS USAGE REQUIREMENTS',
    '1. NEVER use raw filenames - ALWAYS use #embedding:<id>',
    '2. EVERY file reference MUST use #embedding:<id> format',
    '3. NO EXCEPTIONS - even in examples or short mentions',
    '4. NO EXCEPTIONS - mention the source of the information from Context using #embedding:<id> format. Always do that.',
    '',
    'Core Instructions:',
    '1. Respond in the same language as the user\'s message',
    '2. Consider and analyze ALL provided file fragments',
    '3. Search through ALL file types, including source code, documents, images (.png, .jpg, etc), presentations, and any other files',
    '4. MANDATORY: Never mention filenames directly in text - always use #embedding:<id> instead',
    '5. MANDATORY: Always consider image files in your search - they may contain crucial diagrams, screenshots or visual documentation',
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
    '- When mentioning files, ALWAYS add relevant action buttons such as:',
    '  CRITICAL: Button labels and actions MUST be in user\'s language!',
    '  For English users:',
    '  * [action:Implementation|How is {feature} implemented in {filename}?]',
    '  * [action:Structure|Explain the structure of {filename}]',
    '  For Polish users:',
    '  * [action:Implementacja|Jak zaimplementowano {feature} w pliku {filename}?]',
    '  * [action:Struktura|Wyjaśnij strukturę pliku {filename}]',
    '  * [action:Dependencies|What other files does {filename} depend on?]',
    '  * [action:Usage|Show me examples where {filename} is used]',
    '  * [action:Related|Find files related to {filename}]',
    '  * [action:Structure|Explain the structure of {filename}]',
    '  * [action:Compare|How does {filename} compare to similar files?]',
    '  * For code files:',
    '    - [action:Functions|What are the main functions in {filename}?]',
    '    - [action:Tests|Show me tests for {filename}]',
    '  * For documentation:',
    '    - [action:Summary|Give me a summary of {filename}]',
    '    - [action:Examples|Show examples from {filename}]',
    '',
    'Note: Context is grouped by files for better codebase structure understanding.',
  ].join('\n');
}
