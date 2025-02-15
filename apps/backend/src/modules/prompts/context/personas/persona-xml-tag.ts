import { xml } from '../../xml';

type PersonaXMLOptions = {
  name: string;
  description: string;
  children: string[];
};

export function personaXML({ name, description, children }: PersonaXMLOptions): string {
  return xml('persona', {
    children: [
      xml('description', {
        children: [description],
      }),
      ...children,
    ],
    attributes: {
      name,
    },
  });
}
