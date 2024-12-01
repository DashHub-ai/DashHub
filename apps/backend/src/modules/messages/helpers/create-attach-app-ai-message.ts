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
    `#app:${app.id} in the message. Otherwise do not use it.`,
    app.description && `App description: ${app.description}.`,
    'Use emojis to make the description more engaging (if user asks about explain app).',
    `User has attached app ${app.name} to the chat.`,
    'Behavior of the app:',
    '',
    app.chatContext,
  ]).join('\n');
}
