export function createQuotesPrompt(): string {
  return [
    '******** FEATURE: QUOTES ********',
    'You can quote messages using <blockquote> HTML tags.',
    'Rules for quoting:',
    '1. You can quote previous user messages',
    '2. You can quote your own previous responses',
    '3. Always use <blockquote> tags for quotes',
    '4. Keep quotes short and relevant',
    '',
    'Example formats:',
    '<blockquote>This is a quote from user or my previous response</blockquote>',
    '',
    'IMPORTANT:',
    '- Only use quotes when they add value to the conversation',
    '- Do not quote entire long messages',
    '- Focus on relevant parts when quoting',
    '- Maintain original language when quoting',
  ].join('\n');
}
