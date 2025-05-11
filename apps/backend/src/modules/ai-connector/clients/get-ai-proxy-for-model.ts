import type { SdkAIModelT } from '@dashhub/sdk';
import type { SearchEnginesService } from '~/modules/search-engines';

import type { AIProxy } from './ai-proxy';

import { AIDeepSeekModel } from './ai-deepseek-proxy';
import { AIGeminiProxy } from './ai-gemini-proxy';
import { AIOpenAIProxy } from './ai-openai-proxy';

export function getAIModelProxyForModel(searchEnginesService: SearchEnginesService) {
  return (aiModel: SdkAIModelT): AIProxy => {
    switch (aiModel.provider) {
      case 'deepseek':
        return new AIDeepSeekModel(aiModel, searchEnginesService);

      case 'other':
      case 'openai':
        return new AIOpenAIProxy(aiModel, searchEnginesService);

      case 'gemini':
        return new AIGeminiProxy(aiModel, searchEnginesService);

      default: {
        throw new Error(`FIXME: Unsupported AI provider: ${aiModel.provider}`);
      }
    }
  };
}
