import sanitizeHtml from 'sanitize-html';

export function sanitizeContentPreservingCodeBlocks(content: string): string {
  const codeBlocks: string[] = [];

  // Split content by ``` to handle unclosed blocks
  const parts = content.split('```');
  let result = parts[0];

  // Process alternating text/code blocks
  for (let i = 1; i < parts.length; i++) {
    if (i % 2 === 1) {
      // This is a code block
      const placeholder = `__CODE_BLOCK_${Math.floor(i / 2)}__`;
      const codeContent = `\`\`\`${parts[i]}${i < parts.length - 1 ? '```' : ''}`;
      codeBlocks.push(codeContent);
      result += placeholder;
    }
    else {
      // This is regular text
      result += parts[i];
    }
  }

  const sanitizedContent = sanitizeHtml(result);

  // Restore code blocks
  return sanitizedContent.replace(/__CODE_BLOCK_(\d+)__/g, (_, index) =>
    codeBlocks[Number.parseInt(index, 10)]);
}
