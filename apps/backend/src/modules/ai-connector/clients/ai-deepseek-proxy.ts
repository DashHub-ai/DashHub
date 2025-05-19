import type { SdkAIModelT } from '@dashhub/sdk';
import type { SearchEnginesService } from '~/modules/search-engines';

import { AIOpenAIProxy } from './ai-openai-proxy';

export class AIDeepSeekModel extends AIOpenAIProxy {
  constructor(
    aiModel: SdkAIModelT,
    searchEnginesService: SearchEnginesService,
  ) {
    super(
      {
        ...aiModel,
        credentials: {
          ...aiModel.credentials,
          apiUrl: 'https://api.deepseek.com/v1',
        },
      },
      searchEnginesService,
    );
  }
}
