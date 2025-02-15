import type { FalsyItem } from '@llm/commons';

import { xml } from '../../xml';

type FeatureXMLOptions = {
  name: string;
  description: string;
  children: FalsyItem<string>[];
};

export function featureXML({ name, description, children }: FeatureXMLOptions): string {
  return xml('feature', {
    attributes: {
      name,
    },
    children: [
      xml('description', {
        children: [description],
      }),
      ...children ?? [],
    ],
  });
}
