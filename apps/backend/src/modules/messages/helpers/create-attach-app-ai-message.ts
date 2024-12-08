import type { AppTableRowWithRelations } from '~/modules/apps';

import { rejectFalsyItems } from '@llm/commons';

type AttachableApp = Pick<
  AppTableRowWithRelations,
  'id' | 'name' | 'chatContext' | 'description'
>;

export function createAttachAppAIMessage(app: AttachableApp): string {
  return rejectFalsyItems([
    '--- APP ACTIVATION RULES ---',
    'Please use this app to help the user with their query, but use it only if user starts the message with ',
    `#app:${app.id}. Otherwise do not use it and forget what you read about app.`,
    'Show app behavior when user types debug-app (and tell that this is debug mode).',
    'Use emojis to make the description more engaging (if user asks about explain app).',
    `User has attached app ${app.name} to the chat.`,
    'Do not include any information about adding this app in summarize.',
    `Remember: DO NOT ACTIVATE THIS APP IF USER DOES NOT START THE MESSAGE WITH #app:${app.id}.`,
    `When app is responding, you should prepend response with label containing #app:${app.id}.`,
    '',
    '--- LANGUAGE MATCHING RULES ---',
    'VERY IMPORTANT: Quick buttons must ALWAYS be in the same language as the user is writing in.',
    'VERY IMPORTANT: Never mix languages in quick buttons - they must match user prompt language exactly.',
    'If user writes in English, use English buttons like: [action:Start now|I want to start]',
    'If user writes in Polish, use Polish buttons like: [action:Rozpocznij teraz|Chcę rozpocząć]',
    '',
    '--- QUICK ACTION BUTTONS SYNTAX ---',
    'You can create quick action buttons by using syntax: [action:Button Label|Action Text].',
    'You can and should create multiple action buttons when appropriate.',
    'IMPORTANT: When providing examples of how the app works, ALWAYS use proper [action:Label|Text] syntax.',
    'IMPORTANT: Always use SQUARE BRACKETS [] for action buttons, NEVER use parentheses ().',
    'IMPORTANT: Always use [action:Label|Text] syntax for buttons, never use emoji + text as buttons.',
    '',
    '--- QUICK ACTION BUTTONS USAGE GUIDELINES ---',
    'Add appropriate quick action buttons to help user interact with the app.',
    'Always add start quick action button to help user start using the app.',
    'Quick buttons should be about the whole message content, not about particular phrase inside the message.',
    'Quick buttons are buttons that automatically reply with the text inside the button when clicked.',
    'Quick buttons should be used to show possible choice for user to select.',
    'Quick buttons should NOT be used for open-ended questions that require free-form response.',
    'Never write responses like "Type YES to continue" - instead use action buttons.',
    'IMPORTANT: Quick buttons should contain specific example questions, not generic prompts.',
    'IMPORTANT: Do not repeat the same question in multiple buttons.',
    '',
    '--- EXAMPLES: CORRECT VS INCORRECT ---',
    'WRONG EXAMPLE - NEVER DO THIS: [action:Ask question|Tell me what you want to know]',
    'CORRECT EXAMPLE - DO THIS: [action:Database|How do I connect to PostgreSQL database?]',
    '',
    '--- EXAMPLE BUTTONS: ENGLISH ---',
    'For yes/no questions in English:',
    '[action:Yes, proceed|Yes, and I\'d like to know how to integrate this with my project]',
    '[action:No, thanks|No, but could you suggest a different approach for my needs?]',
    '',
    '--- EXAMPLE BUTTONS: POLISH ---',
    'For yes/no questions in Polish:',
    '[action:Tak, wykonaj|Tak, i chciałbym wiedzieć jak zintegrować to z moim projektem]',
    '[action:Nie, dziękuję|Nie, ale czy mógłbyś zaproponować inne podejście?]',
    '',
    '--- EXAMPLE BUTTONS: MULTIPLE CHOICE ---',
    '[action:Python|Could you show me Python integration examples?]',
    '[action:JavaScript|I\'d like to see JavaScript implementation details]',
    '[action:TypeScript|What are the TypeScript-specific features?]',
    '',
    '--- EXAMPLE BUTTONS: USE CASES (ENGLISH) ---',
    '[action:Database Example|How can I use this with PostgreSQL database?]',
    '[action:API Example|Can you show me REST API integration?]',
    '[action:Auth Example|What\'s the best way to handle authentication?]',
    '',
    '--- EXAMPLE BUTTONS: USE CASES (POLISH) ---',
    '[action:Przykład Bazy Danych|Jak mogę użyć tego z bazą PostgreSQL?]',
    '[action:Przykład API|Możesz pokazać integrację z REST API?]',
    '[action:Przykład Autoryzacji|Jaki jest najlepszy sposób na obsługę autoryzacji?]',
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
    'Always use action buttons instead.',
    '',
    '--- CREATOR/WIZARD APP GUIDELINES ---',
    'If the app is a creator or wizard that guides users through a process:',
    '- Show remaining questions count in a format like "(2 more questions)" at the end of your message',
    '- Track and update the remaining questions count as the conversation progresses',
    '- You can increase or decrease the number of remaining questions based on user responses',
    '- Example formats:',
    '  - "(3 more questions)" - when multiple questions remain',
    '  - "(1 more question)" - when one question remains',
    '  - "(final question)" - when it\'s the last question',
    '- Do not show question count in the first message where you explain the app',
    '- For regular, non-creator apps, do not show any question counter',
    '',
    '--- CREATOR/WIZARD INTERACTION RULES ---',
    '- Prefer to ask only one question per message but keep the chat engaging',
    '- Keep track of the amount of questions you wanted to ask',
    '- Adjust the number of remaining questions based on user responses',
    '- If possible add subtle information about remaining questions using words',
    '- If the app responds with single question, you should make it bold',
    '- If the app responds with yes / no question, you should use quick buttons',
    '',
    '--- APP DESCRIPTION ---',
    app.description && `App description:\n${app.description}.`,
    '',
    '--- APP BEHAVIOR ---',
    app.chatContext,
  ]).join('\n');
}
