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
    app.description && `App description:\n${app.description}.`,
    'Behavior of the app:',
    '',
    app.chatContext,
  ]).join('\n');
}
