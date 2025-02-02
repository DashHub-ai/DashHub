import clsx from 'clsx';
import { CheckIcon, WandSparklesIcon } from 'lucide-react';
import { memo } from 'react';

import type { SdkTableRowIdT } from '@llm/sdk';

import { useCachedAppLookup } from '../use-cached-app-lookup';

export type AppChatBadgeProps = {
  id: SdkTableRowIdT;
  darkMode?: boolean;
  selected?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export const AppChatBadge = memo(({ id, darkMode, selected, onClick, className, disabled }: AppChatBadgeProps) => {
  const value = useCachedAppLookup(id);

  return (
    <span
      onClick={onClick}
      className={clsx(
        'inline-flex relative items-center gap-1.5 px-2 py-1.5 rounded-md text-xs transition-all',
        {
          'bg-gray-100/50 text-gray-600': !darkMode && !selected,
          'bg-gray-600/30 text-gray-200': darkMode && !selected,
          'bg-blue-100/50 text-blue-700': selected && !darkMode,
          'bg-blue-800/50 text-blue-100': selected && darkMode,
          'opacity-50 cursor-not-allowed': disabled,
          'hover:bg-gray-200/70': !darkMode && !selected && onClick && !disabled,
          'hover:bg-gray-600/50': darkMode && !selected && onClick && !disabled,
          'cursor-pointer hover:scale-105 active:scale-95': onClick && !disabled,
        },
        className,
      )}
    >
      <WandSparklesIcon size={12} />
      <span>{value.status === 'success' ? value.data?.name : '...'}</span>
      {selected && <CheckIcon size={12} />}
    </span>
  );
});
