import type { SdkSearchMessageItemT } from '@llm/sdk';

export function getLastUsedAIModel(messages: SdkSearchMessageItemT[]) {
  return messages.findLast(message => message.aiModel)?.aiModel;
}
