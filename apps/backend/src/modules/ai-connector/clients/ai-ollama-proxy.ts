import type { SdkAIModelT } from '@dashhub/sdk';
import type { SearchEnginesService } from '~/modules/search-engines';

import { AIOpenAIProxy } from './ai-openai-proxy';

const OLLAMA_DEFAULT_URL = 'http://localhost:11434/v1';

export class AIollamaProxy extends AIOpenAIProxy {
  constructor(
    aiModel: SdkAIModelT,
    searchEnginesService: SearchEnginesService,
  ) {
    super(
      {
        ...aiModel,
        credentials: {
          ...aiModel.credentials,
          apiUrl: aiModel.credentials.apiUrl || OLLAMA_DEFAULT_URL,
          // Ollama's OpenAI-compatible API accepts any non-empty key
          apiKey: aiModel.credentials.apiKey || 'ollama',
        },
      },
      searchEnginesService,
    );
  }
}
