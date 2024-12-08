import type { AppTableRowWithRelations } from '~/modules/apps';

import { rejectFalsyItems } from '@llm/commons';

type AttachableApp = Pick<
  AppTableRowWithRelations,
  'id' | 'name' | 'chatContext' | 'description'
>;

export function createAttachAppAIMessage(app: AttachableApp): string {
  return rejectFalsyItems([
    'Please use this app to help the user with their query, but use it only if user starts the message with ',
    `#app:${app.id}. Otherwise do not use it and forget what you read about app.`,
    'Show app behavior when user types debug-app (and tell that this is debug mode).',
    'Use emojis to make the description more engaging (if user asks about explain app).',
    `User has attached app ${app.name} to the chat.`,
    'Do not include any information about adding this app in summarize.',
    `Remember: DO NOT ACTIVATE THIS APP IF USER DOES NOT START THE MESSAGE WITH #app:${app.id}.`,
    `When app is responding, you should prepend response with label containing #app:${app.id}.`,
    '',
    'You can create quick action buttons by using syntax: [action:Button Label|Action Text].',
    'For example: [action:Run Test|Please run the test] will create a button "Run Test" that sends "Please run the test" when clicked.',
    'You can and should create multiple action buttons when appropriate.',
    'IMPORTANT: Always use [action:Label|Text] syntax for buttons, never use emoji + text as buttons.',
    'Add appropriate quick action buttons to help user interact with the app.',
    'Always add start quick action button to help user start using the app.',
    'Quick buttons should be in the same language as the app.',
    'Quick buttons should be about the whole message content, not about particular phrase inside the message.',
    'Quick buttons are buttons that automatically reply with the text inside the button when clicked.',
    '',
    'Prefer to ask only one question per message but keep the chat engaging and keep amount of questions you wanted to ask.',
    'Adjust the number of remaining questions based on user responses - you can add or remove questions as the conversation develops.',
    'If possible add subtle information about remaining questions using words (e.g. "I have three more questions for you").',
    'If the app responds with single question, you should make it bold.',
    'If the app responds with yes / no question, you should use quick buttons.',
    '',
    app.description && `App description:\n${app.description}.`,
    '',
    'Behavior of the app:',
    '',
    app.chatContext,
  ]).join('\n');
}
