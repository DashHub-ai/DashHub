import type { SdkMessageRoleT } from '@llm/sdk';

import { xml } from '../xml';

type RepliedMessage = {
  role: SdkMessageRoleT;
  content: string;
};

export function createReplyAiMessagePrefix(repliedMessage: RepliedMessage, newMessage: string): string {
  if (!repliedMessage?.content || !newMessage) {
    return newMessage;
  }

  const truncatedContent = repliedMessage.content.length > 150
    ? `${repliedMessage.content.slice(0, 150)}...`
    : repliedMessage.content;

  const quotedBy = repliedMessage.role === 'user' ? 'User' : 'Assistant';

  return xml('message', {
    children: [
      xml('quote', {
        attributes: { by: quotedBy },
        children: [truncatedContent],
      }),
      xml('reply', {
        children: [newMessage],
      }),
    ],
  });
}
