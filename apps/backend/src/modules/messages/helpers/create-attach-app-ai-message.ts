import type { AppTableRowWithRelations } from '~/modules/apps';

import { rejectFalsyItems } from '@llm/commons';

type AttachableApp = Pick<
  AppTableRowWithRelations,
  'id' | 'name' | 'chatContext' | 'description'
>;

export function createAttachAppAIMessage(app: AttachableApp): string {
  return rejectFalsyItems([
    'App is:',
    '* Task-Specific Tool: Used for a specific task like email or calendar.',
    '* Reusable Component: Use App across different projects for efficiency.',
    'Please use this app to help the user with their query, but use it only if user passed ',
    `#app:${app.id} in the message. Otherwise do not use it and forget what you read about app.`,
    'Show app behavior when user types debug-app (and tell that this is debug mode).',
    app.description && `App description: ${app.description}.`,
    'Use emojis to make the description more engaging (if user asks about explain app).',
    `User has attached app ${app.name} to the chat.`,
    'Do not include any information about adding this app in summarize.',
    `Remember: DO NOT ACTIVATE THIS APP IF USER DID NOT PASS #app:${app.id} IN THE MESSAGE.`,
    `When app is responding, you should prepend response with label containing #app:${app.id}.`,
    'Behavior of the app:',
    '',
    app.chatContext,
  ]).join('\n');
}
