import type { SdkSearchMessageItemT } from '../dto';

type SdkMessageLike = Pick<SdkSearchMessageItemT, 'repliedMessage'>;

export type SdkRepeatedMessageLike<M extends SdkMessageLike> = M & {
  repeats: M[];
};

export function groupSdkMessagesByRepeats<M extends SdkMessageLike>(
  messages: M[],
): SdkRepeatedMessageLike<M>[] {
  return messages
    .toReversed()
    .reduce<Array<SdkRepeatedMessageLike<M>>>((acc, message) => {
      const lastMessage = acc[acc.length - 1];

      if (lastMessage?.repliedMessage && lastMessage.repliedMessage.id === message.repliedMessage?.id) {
        lastMessage.repeats.push(message);
      }
      else {
        acc.push({ ...message, repeats: [] });
      }

      return acc;
    }, [])
    .toReversed();
}
