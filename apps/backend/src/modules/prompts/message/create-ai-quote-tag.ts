import type { Nullable } from '@dashhub/commons';
import type { SdkMessageRoleT } from '@dashhub/sdk';

import { xml } from '../xml';

type RepliedMessage = {
  role: SdkMessageRoleT;
  content: string;
};

export function createAIQuoteTag(repliedMessage: Nullable<RepliedMessage>): string | null {
  if (!repliedMessage?.content) {
    return null;
  }

  const truncatedContent = repliedMessage.content.length > 150
    ? `${repliedMessage.content.slice(0, 150)}...`
    : repliedMessage.content;

  const quotedBy = repliedMessage.role === 'user' ? 'User' : 'Assistant';

  return xml('prompt-quote', {
    attributes: { by: quotedBy },
    children: [truncatedContent],
  });
}
