import type { XmlTagOptions } from '../../xml';

import { xml } from '../../xml';

export function embeddingsXML({ children, ...options }: XmlTagOptions = {}) {
  return xml('rag-embeddings-context', {
    ...options,
    children: [
      xml('description', {
        children: ['Context and instructions for handling embeddings in responses found by RAG'],
      }),
      ...(children || []),
    ],
  });
}
