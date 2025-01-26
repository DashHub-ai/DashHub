import type { SdkAIModelT } from '@llm/sdk';

import { AIOpenAIProxy } from './ai-openai-proxy';

export class AIDeepSeekModel extends AIOpenAIProxy {
  constructor(aiModel: SdkAIModelT) {
    super({
      ...aiModel,
      credentials: {
        ...aiModel.credentials,
        apiUrl: 'https://api.deepseek.com/v1',
      },
    });
  }
}
