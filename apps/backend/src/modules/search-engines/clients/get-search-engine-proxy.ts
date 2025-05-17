import type { SdkSearchEngineT } from '@dashhub/sdk';

import { SerperProxy } from './serper-proxy';

export function getSearchEngineProxy(engine: SdkSearchEngineT) {
  switch (engine.provider) {
    case 'serper':
      return new SerperProxy(engine);

    default: {
      throw new Error(`FIXME: Unsupported search engine provider: ${engine.provider}`);
    }
  }
}
