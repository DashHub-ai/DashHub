import { xml } from '../xml';
import {
  createActionButtonsContextPrompt,
  createQuotesContextPrompt,
} from './features';
import { createDefaultPersonaContextPrompt } from './personas';

export function createContextPrompt() {
  return xml('general-chat-context', {
    attributes: {
      name: 'General Chat',
      description: 'A general chat context for the user.',
    },
    children: [
      createDefaultPersonaContextPrompt(),
      createQuotesContextPrompt(),
      createActionButtonsContextPrompt(),
    ],
  });
}
