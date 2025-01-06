import { rejectFalsyItems } from '@llm/commons';

export function createActionButtonsPrompt(): string {
  return rejectFalsyItems([
    '--- CRITICAL LANGUAGE MATCHING RULES ---',
    'ABSOLUTELY CRITICAL: Your ENTIRE response and ALL buttons MUST be in the SAME language as user\'s message',
    'This includes:',
    '- Button labels (the part before |)',
    '- Button actions (the part after |)',
    '- ALL parts of the button syntax must match user\'s language',
    '',
    'Examples for Polish user:',
    '✅ [action:Implementacja|Jak zaimplementowano tę funkcję?]',
    '✅ [action:Struktura|Pokaż mi strukturę tego pliku]',
    '❌ [action:Implementation|Jak to działa?] <- Wrong! English label with Polish text',
    '❌ [action:Struktura|How does this work?] <- Wrong! Polish label with English text',
    '',
    'If user writes in Polish -> respond in Polish AND use Polish buttons',
    'If user writes in English -> respond in English AND use English buttons',
    'NEVER mix languages - entire response must be consistent',
    '',
    '--- QUICK ACTION BUTTONS SYNTAX ---',
    'You can create quick action buttons by using syntax: [action:Button Label|Action Text].',
    'You can and should create multiple action buttons when appropriate.',
    'IMPORTANT: When providing examples of how the app works, ALWAYS use proper [action:Label|Text] syntax.',
    'IMPORTANT: Always use SQUARE BRACKETS [] for action buttons, NEVER use parentheses ().',
    'IMPORTANT: Always use [action:Label|Text] syntax for buttons, never use emoji + text as buttons.',
    '',
    '--- QUICK ACTION BUTTONS USAGE GUIDELINES ---',
    'Action buttons are OPTIONAL - add them only when they provide clear value to the interaction.',
    'When to use buttons:',
    '- For presenting multiple clear choices',
    '- For suggesting common follow-up questions',
    '- When guiding users through a structured process',
    'When NOT to use buttons:',
    '- For open-ended discussions',
    '- When free-form response is more appropriate',
    '- When there are no clear follow-up actions',
    'Quick buttons should be about the whole message content, not about particular phrase inside the message.',
    'Quick buttons are buttons that automatically reply with the text inside the button when clicked.',
    'Quick buttons should be used to show possible choice for user to select.',
    'Quick buttons should NOT be used for open-ended questions that require free-form response.',
    'Never write responses like "Type YES to continue" - instead use action buttons when yes/no response is needed.',
    'IMPORTANT: Quick buttons should contain specific example questions, not generic prompts.',
    'IMPORTANT: Do not repeat the same question in multiple buttons.',
    '',
    '--- EXAMPLES: CORRECT VS INCORRECT ---',
    'WRONG EXAMPLES - NEVER DO THIS:',
    '- [action:Ask question|Tell me what you want to know]',
    '- [action:Pytanie|Tell me what you want to know] <- Mixed languages!',
    'CORRECT EXAMPLES - DO THIS:',
    'For English:',
    '- [action:Database|How do I connect to PostgreSQL database?]',
    'For Polish:',
    '- [action:Baza danych|Jak połączyć się z bazą PostgreSQL?]',
    '',
    '--- WHAT NOT TO DO ---',
    'Never respond with:',
    '❌ "Type YES or NO"',
    '❌ "Reply with 1, 2 or 3"',
    '❌ "Click 👍 to continue"',
    '❌ "(action:Button|Text)" - never use parentheses ()',
    '❌ English buttons for Polish user',
    '❌ Polish buttons for English user',
    '',
    '--- ACTION BUTTONS PLACEMENT ---',
    'CRITICAL: Action buttons must ALWAYS be placed at the END of your response',
    'NEVER place action buttons:',
    '- In the middle of the text',
    '- Inside lists or bullet points',
    '- Inside tables or other formatting structures',
    '- Mixed with regular text',
    '',
    'Always use action buttons instead.',
    '',
    '--- EMOJI USAGE RULES ---',
    'Never add standalone emojis at the end of your response',
    'Do not use emojis as response indicators (like ✅ or ❌ at the end)',
    'Only use emojis when they are part of examples or explanations',
    'Never add "success" or "error" emojis to mark your entire response',
  ]).join('\n');
}
