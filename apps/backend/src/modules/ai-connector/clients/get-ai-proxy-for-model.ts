import type { SdkAIModelT } from '@llm/sdk';

import type { AIProxy } from './ai-proxy';

import { AIDeepSeekModel } from './ai-deepseek-proxy';
import { AIGeminiProxy } from './ai-gemini-proxy';
import { AIOpenAIProxy } from './ai-openai-proxy';

export function getAIModelProxyForModel(aiModel: SdkAIModelT): AIProxy {
  switch (aiModel.provider) {
    case 'deepseek':
      return new AIDeepSeekModel(aiModel);

    case 'other':
    case 'openai':
      return new AIOpenAIProxy(aiModel);

    case 'gemini':
      return new AIGeminiProxy(aiModel);

    default: {
      throw new Error(`FIXME: Unsupported AI provider: ${aiModel.provider}`);
    }
  }
}
