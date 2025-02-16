import clsx from 'clsx';
import { CheckIcon, SearchIcon } from 'lucide-react';
import { memo } from 'react';

import type { SdkMessageWebSearchItemT } from '@llm/sdk';

import { type Nullable, truncateText } from '@llm/commons';
import { useBalloon } from '~/ui';

import { WebSearchPreview } from './websearch-preview';

function getFaviconUrl(url: string) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&size=16`;
  }
  catch {
    return null;
  }
}

export type WebSearchChatBadgeProps = {
  title?: Nullable<string>;
  item: SdkMessageWebSearchItemT;
  darkMode?: boolean;
  selected?: boolean;
  className?: string;
  disabled?: boolean;
};

export const WebSearchChatBadge = memo((
  {
    title,
    item,
    darkMode,
    selected,
    className,
    disabled,
  }: WebSearchChatBadgeProps,
) => {
  const balloon = useBalloon<HTMLButtonElement>();

  const onToggleBallon = () => {
    if (balloon.toggled) {
      balloon.hide();
      return;
    }

    void balloon.show(
      <WebSearchPreview item={item} />,
    );
  };

  const isOn = selected || balloon.toggled;
  const faviconUrl = getFaviconUrl(item.url);

  return (
    <button
      type="button"
      ref={balloon.targetRef}
      onClick={onToggleBallon}
      disabled={disabled}
      className={clsx(
        'inline-flex top-[2px] relative items-center gap-1.5 px-2 py-1.5 rounded-md text-xs truncate transition-all',
        {
          'bg-gray-100/50 text-gray-600 hover:bg-gray-200/70': !darkMode && !isOn,
          'bg-gray-600/30 text-gray-200 hover:bg-gray-600/50': darkMode && !isOn,
          'bg-blue-100/50 text-blue-700': isOn && !darkMode,
          'bg-blue-800/50 text-blue-100': isOn && darkMode,
          'opacity-50 cursor-not-allowed': disabled,
          'cursor-pointer hover:scale-105 active:scale-95': !disabled,
        },
        className,
      )}
    >
      {faviconUrl
        ? (
            <img src={faviconUrl} alt="" className="m-0 p-0 w-4 h-4" />
          )
        : (
            <SearchIcon size={10} />
          )}
      <span className="flex items-center gap-1">
        <span>{title ?? truncateText(25, '...')(item.title)}</span>
      </span>
      {selected && <CheckIcon size={12} />}
    </button>
  );
});
