import { xml } from '../../xml';
import { personaXML } from './persona-xml-tag';

export function createCustomPersonaContextPrompt(personality: string): string {
  return personaXML({
    name: 'Persona defined by the user',
    description: 'Behave the way defined by the user.',
    children: [
      xml('behavior', {
        children: [personality],
      }),
    ],
  });
}
