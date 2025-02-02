import { createActionButtonsPrompt } from './create-action-buttons-prompt';
import { createQuotesPrompt } from './create-quotes-prompt';

export function createContextPrompt() {
  return [
    createQuotesPrompt(),
    createActionButtonsPrompt(),
  ].join('\n');
}
