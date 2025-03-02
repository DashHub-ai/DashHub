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
  isNonBlankPersona,
  type PersonaPersonalities,
} from './personas';

type Attrs = {
  personalities?: PersonaPersonalities;
};

export function createContextPrompt({ personalities }: Attrs) {
  return xml('general-chat-context', {
    attributes: {
      name: 'General Chat',
      description: 'A general chat context for the user.',
    },
    children: [
      createCriticalContextPrompt(),
      isNonBlankPersona(personalities)
        ? createCustomPersonaContextPrompt(personalities)
        : createDefaultPersonaContextPrompt(),
      createQuotesContextPrompt(),
      createActionButtonsContextPrompt(),
      createHtmlPreviewContextPrompt(),
    ],
  });
}
