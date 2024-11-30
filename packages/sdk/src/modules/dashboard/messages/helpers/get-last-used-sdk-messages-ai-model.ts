import type { SdkSearchMessageItemT } from '../dto';

export function getLastUsedSdkMessagesAIModel(
  messages: Array<Pick<SdkSearchMessageItemT, 'aiModel'>>,
) {
  return messages.findLast(message => message.aiModel)?.aiModel;
}
