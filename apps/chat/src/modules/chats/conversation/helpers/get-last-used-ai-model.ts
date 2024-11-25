import type { SdkSearchMessageItemT } from '@llm/sdk';

export function getLastUsedAIModel(
  messages: Array<Pick<SdkSearchMessageItemT, 'aiModel'>>,
) {
  return messages.findLast(message => message.aiModel)?.aiModel;
}
