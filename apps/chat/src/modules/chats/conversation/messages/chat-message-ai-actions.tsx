import { RefreshCwIcon, ReplyIcon, WandSparklesIcon } from 'lucide-react';

import type { SdkSearchMessageItemT } from '@llm/sdk';

import { useI18n } from '~/i18n';

import { ActionButton } from './action-button';

type Props = {
  isLast: boolean;
  disabled?: boolean;
  message: Pick<SdkSearchMessageItemT, 'aiModel'>;
  onRefreshResponse: () => void;
};

export function ChatMessageAIActions({ isLast, disabled, message, onRefreshResponse }: Props) {
  const t = useI18n().pack.chat.actions;

  return (
    <div className="flex items-center gap-2">
      {isLast && (
        <ActionButton
          disabled={disabled}
          title={t.refresh}
          onClick={onRefreshResponse}
        >
          <RefreshCwIcon size={14} className="opacity-50 hover:opacity-100" />
        </ActionButton>
      )}

      <ActionButton disabled={disabled} title={t.reply}>
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
