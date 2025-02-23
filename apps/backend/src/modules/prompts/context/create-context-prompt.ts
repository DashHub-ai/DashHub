import { xml } from '../xml';
import { createCriticalContextPrompt } from './create-critical-context-prompt';
import {
  createActionButtonsContextPrompt,
  createHtmlPreviewContextPrompt,
  createQuotesContextPrompt,
} from './features';
import {
  createCustomPersonaContextPrompt,
  createDefaultPersonaContextPrompt,
} from './personas';

type Attrs = {
  personality?: string | null;
};

export function createContextPrompt({ personality }: Attrs) {
  return xml('general-chat-context', {
    attributes: {
      name: 'General Chat',
      description: 'A general chat context for the user.',
    },
    children: [
      createCriticalContextPrompt(),
      personality
        ? createCustomPersonaContextPrompt(personality)
        : createDefaultPersonaContextPrompt(),
      createQuotesContextPrompt(),
      createActionButtonsContextPrompt(),
      createHtmlPreviewContextPrompt(),
    ],
  });
}
