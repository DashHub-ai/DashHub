import { type Nullable, rejectFalsyItems } from '@dashhub/commons';

import { xml } from '../../xml';
import { personaXML } from './persona-xml-tag';

export type PersonaPersonalities = {
  organization?: string | null;
  user?: string | null;
};

export function createCustomPersonaContextPrompt({ user, organization }: PersonaPersonalities): string {
  return personaXML({
    name: 'Persona defined by user and organization',
    description: 'Behave according to organization identity and user preferences.',
    children: [
      xml('behavior', {
        children: rejectFalsyItems([
          organization && xml('organization-identity', {
            children: [organization],
            attributes: { immutable: 'true' },
          }),

          user && xml('user-preferences', {
            children: [user],
            attributes: { mutable: 'true' },
          }),
        ]),
      }),
    ],
  });
}

export function isNonBlankPersona(persona: Nullable<PersonaPersonalities>): persona is PersonaPersonalities {
  return !!persona?.user || !!persona?.organization;
}
