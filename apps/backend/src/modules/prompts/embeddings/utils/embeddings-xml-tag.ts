import type { XmlTagOptions } from '../../xml';

import { xml } from '../../xml';

export function embeddingsXML({ children, ...options }: XmlTagOptions = {}) {
  return xml('embeddings-context', {
    ...options,
    children: [
      xml('description', {
        children: ['Context and instructions for handling embeddings in responses'],
      }),
      ...(children || []),
    ],
  });
}
