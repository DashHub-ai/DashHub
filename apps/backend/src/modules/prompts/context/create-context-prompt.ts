import {
  createActionButtonsContextPrompt,
  createQuotesContextPrompt,
} from './features';
import { createDefaultPersonaContextPrompt } from './personas';

export function createContextPrompt() {
  return [
    createDefaultPersonaContextPrompt(),
    createQuotesContextPrompt(),
    createActionButtonsContextPrompt(),
  ].join('\n');
}
