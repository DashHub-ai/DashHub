import { RefreshCwIcon, ReplyIcon, WandSparklesIcon } from 'lucide-react';

import type { SdkSearchMessageItemT } from '@llm/sdk';

type Props = {
  isLast: boolean;
  message: SdkSearchMessageItemT;
};

export function ChatMessageAIActions({ isLast, message }: Props) {
  return (
    <div className="flex items-center gap-2">
      {isLast && (
        <button
          type="button"
          className="hover:bg-gray-200 p-1 rounded transition-colors"
          title="Refresh response"
        >
          <RefreshCwIcon size={14} className="opacity-50 hover:opacity-100" />
        </button>
      )}

      <button
        type="button"
        className="hover:bg-gray-200 p-1 rounded transition-colors"
        title="Reply to this message"
      >
        <ReplyIcon size={14} className="opacity-50 hover:opacity-100" />
      </button>

      {(message as any).aiModel && (
        <div className="flex items-center gap-1 text-muted-foreground">
          <WandSparklesIcon size={12} />
          <span>{(message as any).aiModel}</span>
        </div>
      )}
    </div>
  );
}
