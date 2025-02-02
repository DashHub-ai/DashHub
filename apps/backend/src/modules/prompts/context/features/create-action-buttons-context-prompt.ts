import { wrapWithFeaturePromptHeader } from './wrap-with-feature-prompt-header';

export function createActionButtonsContextPrompt(): string {
  return wrapWithFeaturePromptHeader('ACTION BUTTONS', [
    '--- INTELLIGENT USAGE RULES ---',
    'Action buttons are not needed in every situation.',
    'Only add them when the user explicitly needs to choose between several options:',
    '1. When the message implies a choice among multiple distinct paths',
    '2. When each option leads to a clearly different outcome',
    '3. When the response requires explicit selection to proceed',
    '',
    'DO NOT USE buttons for general information, simple explanations, or non-selective replies.',
    '',
    '--- BUTTON SYNTAX AND PLACEMENT ---',
    'Format: [action:Button Label|Action Text]',
    'Always place buttons at the end of the response when required.',
    'Never mix buttons with regular text.',
    '',
    '--- EXAMPLES ---',
    'Example 1: Choosing between technologies:',
    '   [action:REST API|Show REST API implementation]',
    '   [action:GraphQL|Show GraphQL implementation]',
    '',
    'Example 2: Different implementation approaches:',
    '   [action:Sync|Show synchronous implementation]',
    '   [action:Async|Show asynchronous implementation]',
    '',
    '--- REMEMBER ---',
    'Only include buttons when a clear choice is necessary.',
    'Better to have no buttons than to clutter the response unnecessarily.',
  ]);
}
