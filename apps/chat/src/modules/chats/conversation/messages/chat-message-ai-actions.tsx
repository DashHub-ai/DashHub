import { RefreshCwIcon, ReplyIcon, WandSparklesIcon } from 'lucide-react';

import type { SdkSearchMessageItemT } from '@llm/sdk';

import { ActionButton } from './action-button';

type Props = {
  isLast: boolean;
  disabled?: boolean;
  message: Pick<SdkSearchMessageItemT, 'aiModel'>;
};

export function ChatMessageAIActions({ isLast, disabled, message }: Props) {
  return (
    <div className="flex items-center gap-2">
      {isLast && (
        <ActionButton disabled={disabled} title="Refresh response">
          <RefreshCwIcon size={14} className="opacity-50 hover:opacity-100" />
        </ActionButton>
      )}

      <ActionButton disabled={disabled} title="Reply to this message">
        <ReplyIcon size={14} className="opacity-50 hover:opacity-100" />
      </ActionButton>

      {message.aiModel && (
        <div className="flex items-center gap-1 text-muted-foreground">
          <WandSparklesIcon size={12} />
          <span>{message.aiModel.name}</span>
        </div>
      )}
    </div>
  );
}
