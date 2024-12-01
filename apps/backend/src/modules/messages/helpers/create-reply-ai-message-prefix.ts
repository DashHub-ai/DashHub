import type { SdkMessageRoleT } from '@llm/sdk';

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

  const quotedBy = repliedMessage.role === 'user' ? 'You' : 'I';

  return `${quotedBy}: "${truncatedContent}"\n\n${newMessage}`;
}