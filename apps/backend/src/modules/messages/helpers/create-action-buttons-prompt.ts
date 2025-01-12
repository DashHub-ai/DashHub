import { rejectFalsyItems } from '@llm/commons';

export function createActionButtonsPrompt(): string {
  return rejectFalsyItems([
    '!!! CRITICAL - READ FIRST !!!',
    'FORBIDDEN BUTTONS - AUTOMATIC REJECTION:',
    'System will AUTOMATICALLY REJECT any response containing these buttons:',
    '1. [action:*|Tell me what you want to know]',
    '2. [action:*|How can I help?]',
    '3. [action:*|What would you like to know?]',
    '4. [action:*|Ask me anything]',
    '5. [action:*|What else?]',
    '6. [action:*|Tell me more]',
    '7. [action:*|What next?]',
    '8. [action:*|Continue]',
    '9. ANY button that asks user to ask a question',
    '10. ANY button that creates question loops',
    '11. ANY generic/vague buttons',
    '',
    'EVERY BUTTON MUST:',
    '1. Ask about SPECIFIC topic',
    '2. Request SPECIFIC information',
    '3. Lead to CONCRETE answer',
    '4. Avoid ANY form of "ask me" pattern',
    '',
    'IF IN DOUBT - DO NOT CREATE BUTTONS',
    'Better NO buttons than BAD buttons',
    '',
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
    'STRICT RULES - ABSOLUTELY FORBIDDEN BUTTONS:',
    '1. NO "ask me a question" buttons',
    '2. NO "what would you like to know" buttons',
    '3. NO "how can I help" buttons',
    '4. NO "tell me more" buttons',
    '5. NO buttons that ask user to ask questions',
    '6. NO generic "continue" buttons',
    '7. NO buttons leading to loops of questions',
    '8. NO buttons with variants of "what else would you like to know?"',
    '',
    'IMPORTANT: BUTTONS MUST:',
    '- Ask SPECIFIC questions about SPECIFIC topics',
    '- Lead to CONCRETE information',
    '- Have clear, defined purpose',
    '- Provide actual value to user',
    '',
    'Action buttons are OPTIONAL - use them when they help guide the user through a process or provide clear choices.',
    'Never use action buttons for open-ended questions or free-form responses.',
    'When to use buttons:',
    '- For presenting multiple clear choices',
    '- For suggesting common follow-up questions',
    '- When guiding users through a structured process',
    'When NOT to use buttons:',
    '- For open-ended discussions',
    '- When free-form response is more appropriate',
    '- When there are no clear follow-up actions',
    '- For recursive questions (like "Ask another question")',
    '- For generic prompts (like "Tell me more")',
    '- When button would just ask user to ask something',
    'Quick buttons should be about the whole message content, not about particular phrase inside the message.',
    'Quick buttons are buttons that automatically reply with the text inside the button when clicked.',
    'Quick buttons should be used to show possible choice for user to select.',
    'NEVER create buttons that:',
    '- Ask user to ask another question',
    '- Have generic "Tell me more" prompts',
    '- Lead to endless loops of questions',
    '- Just rephrase "what would you like to know?"',
    'Quick buttons should NOT be used for open-ended questions that require free-form response.',
    'Never write responses like "Type YES to continue" - instead use action buttons when yes/no response is needed.',
    'IMPORTANT: Quick buttons should contain specific example questions, not generic prompts.',
    'IMPORTANT: Do not repeat the same question in multiple buttons.',
    '',
    '--- EXAMPLES: CORRECT VS INCORRECT ---',
    'ABSOLUTELY FORBIDDEN - NEVER CREATE THESE:',
    '- [action:Ask|Co chcesz wiedzieć?]',
    '- [action:Help|How can I assist you?]',
    '- [action:More|Tell me more about your needs]',
    '- [action:Question|Ask me anything]',
    '- [action:Continue|What next?]',
    '- [action:Info|What would you like to know?]',
    '',
    'CORRECT EXAMPLES - ALWAYS BE THIS SPECIFIC:',
    'For English:',
    '- [action:Error handling|How does the error handling work in this module?]',
    '- [action:Configuration|What are the required environment variables?]',
    'For Polish:',
    '- [action:Obsługa błędów|Jak działa obsługa błędów w tym module?]',
    '- [action:Konfiguracja|Jakie są wymagane zmienne środowiskowe?]',
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
