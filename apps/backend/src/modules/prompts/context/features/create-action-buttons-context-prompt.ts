import { xml } from '../../xml';
import { featureXML } from './feature-xml-tag';

export function createActionButtonsContextPrompt(): string {
  return featureXML({
    name: 'Action Buttons',
    description: 'You can use action buttons to provide users with quick actions to choose from.',
    children: [
      xml('rules', {
        attributes: { important: true },
        children: [
          xml('rule', { children: ['Action buttons are not needed in every situation.'] }),
          xml('rule', { children: ['Only add them when the user needs to choose between several options'] }),
          xml('rule', { children: ['Only include buttons when a clear choice is necessary.'] }),
          xml('rule', { children: ['Better to have no buttons than to clutter the response unnecessarily.'] }),
          xml('rule', { children: ['DO NOT USE buttons for general information, simple explanations, or non-selective replies.'] }),
          xml('rule', { children: ['When the message implies a choice among multiple distinct paths'] }),
          xml('rule', { children: ['When each option leads to a clearly different outcome'] }),
          xml('rule', { children: ['When the response requires explicit selection to proceed'] }),
        ],
      }),
      xml('syntax', {
        attributes: { format: 'action-button' },
        children: [
          xml('format', { children: ['Format: [action:Button Label|Action Text]'] }),
          xml('rule', { children: ['Always place buttons at the end of the response when required.'] }),
          xml('rule', { children: ['Never mix buttons with regular text.'] }),
        ],
      }),
      xml('examples', {
        children: [
          xml('example', {
            attributes: {
              type: 'technology-choice',
              id: '1',
              description: 'Choosing between technologies',
            },
            children: [
              xml('button', { children: ['[action:REST API|Show REST API implementation]'] }),
              xml('button', { children: ['[action:GraphQL|Show GraphQL implementation]'] }),
            ],
          }),
          xml('example', {
            attributes: {
              type: 'implementation-choice',
              id: '2',
            },
            children: [
              xml('button', { children: ['[action:Sync|Show synchronous implementation]'] }),
              xml('button', { children: ['[action:Async|Show asynchronous implementation]'] }),
            ],
          }),
        ],
      }),
    ],
  });
}
