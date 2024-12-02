import clsx from 'clsx';
import { CheckIcon, WandSparklesIcon } from 'lucide-react';
import { memo } from 'react';

import { AsyncTaskCache } from '@llm/commons';
import { useAsyncValue } from '@llm/commons-front';
import { type AppsSdk, type SdkAppT, type SdkTableRowIdT, useSdkForLoggedIn } from '@llm/sdk';

const appChatsCache = new AsyncTaskCache<SdkTableRowIdT, AppsSdk, SdkAppT>(
  (id, sdk) => sdk.get(id),
);

export type AppChatBadgeProps = {
  id: SdkTableRowIdT;
  darkMode?: boolean;
  selected?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export const AppChatBadge = memo(({ id, darkMode, selected, onClick, className, disabled }: AppChatBadgeProps) => {
  const { sdks } = useSdkForLoggedIn();
  const value = useAsyncValue(
    () => appChatsCache.get(id, sdks.dashboard.apps),
    [id],
    {
      initialValue: appChatsCache.getSyncValue(id),
    },
  );

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'inline-flex relative items-center gap-1.5 shadow-sm px-2 py-1 border rounded-md font-medium text-xs transition-colors',
        {
          'bg-gray-100 text-gray-800 border-gray-300 hover:border-gray-400': !darkMode && !selected,
          'bg-gray-700 text-white border-gray-500 hover:border-gray-400': darkMode && !selected,
          'bg-blue-50 border-blue-300 text-blue-700': selected && !darkMode,
          'bg-blue-900 border-blue-700 text-white': selected && darkMode,
          'opacity-50 cursor-not-allowed': disabled,
          'cursor-pointer': !disabled,
        },
        className,
      )}
    >
      <WandSparklesIcon size={12} />
      <span>{value.status === 'success' ? value.data?.name : '...'}</span>
      {selected && <CheckIcon size={12} />}
    </button>
  );
});
