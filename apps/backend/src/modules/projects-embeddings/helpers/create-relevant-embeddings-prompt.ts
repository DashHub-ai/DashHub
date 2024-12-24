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
    'Core Instructions:',
    '1. Respond in the same language as the user\'s message',
    '2. Consider and analyze ALL provided file fragments',
    '3. Search through ALL file types, including source code, documents, images (.png, .jpg, etc), presentations, and any other files',
    '4. MANDATORY: Always consider image files in your search - they may contain crucial diagrams, screenshots or visual documentation',
    '5. MANDATORY: When discussing images, diagrams, screenshots, or visual content:',
    '   - ONLY reference images using #embedding:<id> format - no direct file references allowed',
    '   - Every image mention MUST be prefixed with #embedding:<id>',
    '   - Format: #embedding:<id> describes image showing...',
    '   - Never reference images without proper #embedding:<id>',
    '   - Do NOT add any action buttons for viewing images - this is handled automatically',
    '',
    'List Guidelines:',
    '- Never include empty or meaningless items in lists',
    '- Each list item must contain meaningful content',
    '- Remove or combine items that are too short or redundant',
    '- Ensure each item adds unique value',
    '',
    'Reference Format:',
    '- Direct quotes: #embedding:<id> "quoted text"',
    '- Paraphrasing: #embedding:<id> explains that... or According to #embedding:<id>...',
    '- Multiple sources: Maintain proper #embedding:<id> prefixes for each source',
    '',
    'Response Guidelines:',
    '- Be concise and focused',
    '- For file queries: Provide file name and one-sentence description unless more details requested',
    '- If relevant file found: Suggest its potential usefulness',
    '- If context not relevant: Provide general response',
    '- When mentioning files, ALWAYS add relevant action buttons such as:',
    '  * [action:Implementation|How is {feature} implemented in {filename}?]',
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
