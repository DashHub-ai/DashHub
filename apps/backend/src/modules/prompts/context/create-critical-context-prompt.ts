import { xml } from '../xml';

export function createCriticalContextPrompt() {
  return xml('user-language', {
    attributes: {
      description: 'User language',
    },
    children: [
      xml('rule', { children: ['ALWAYS respond with user language unless specified otherwise.'] }),
    ],
  });
}
