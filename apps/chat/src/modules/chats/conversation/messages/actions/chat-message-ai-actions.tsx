import { RefreshCwIcon, WandSparklesIcon } from 'lucide-react';

import type { SdkSearchMessageItemT } from '@dashhub/sdk';

import { useI18n } from '~/i18n';

import { ToolbarSmallActionButton } from '../buttons';

type Props = {
  isLast: boolean;
  disabled?: boolean;
  message: Pick<SdkSearchMessageItemT, 'aiModel'>;
  onRefreshResponse: () => void;
};

export function ChatMessageAIActions({ isLast, disabled, message, onRefreshResponse }: Props) {
  const t = useI18n().pack.chat.actions;

  return (
    <>
      {isLast && (
        <ToolbarSmallActionButton
          disabled={disabled}
          title={t.refresh}
          icon={<RefreshCwIcon size={14} className="text-gray-500" />}
          onClick={onRefreshResponse}
        />
      )}

      {message.aiModel && (
        <div className="flex items-center gap-1.5 bg-gray-100/50 px-2 py-1.5 rounded-md text-gray-600 text-xs">
          <WandSparklesIcon size={12} />
          <span>{message.aiModel.name}</span>
        </div>
      )}
    </>
  );
}
