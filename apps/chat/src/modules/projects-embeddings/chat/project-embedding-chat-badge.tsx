import clsx from 'clsx';
import { CheckIcon, FileIcon } from 'lucide-react';
import { memo } from 'react';

import { AsyncTaskCache } from '@llm/commons';
import { useAsyncValue } from '@llm/commons-front';
import {
  type ProjectsEmbeddingsSdk,
  type SdkSearchProjectEmbeddingItemT,
  type SdkTableRowIdT,
  useSdkForLoggedIn,
} from '@llm/sdk';

const embeddingsChatsCache = new AsyncTaskCache<
  SdkTableRowIdT,
  ProjectsEmbeddingsSdk,
  SdkSearchProjectEmbeddingItemT
>(
  (id, sdk) => sdk.get(id),
);

export type ProjectEmbeddingChatBadgeProps = {
  id: SdkTableRowIdT;
  darkMode?: boolean;
  selected?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export const ProjectEmbeddingChatBadge = memo((
  {
    id,
    darkMode,
    selected,
    onClick,
    className,
    disabled,
  }: ProjectEmbeddingChatBadgeProps,
) => {
  const { sdks } = useSdkForLoggedIn();
  const value = useAsyncValue(
    () => embeddingsChatsCache.get(id, sdks.dashboard.projectsEmbeddings),
    [id],
    {
      initialValue: embeddingsChatsCache.getSyncValue(id),
    },
  );

  return (
    <button
      id={`embedding-${id}`}
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'inline-flex relative items-center gap-1.5 shadow-sm px-1.5 py-0.5 border rounded-md font-semibold text-xs transition-all',
        {
          'bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200 hover:border-gray-400': !darkMode && !selected,
          'bg-gray-700 text-white border-gray-500 hover:bg-gray-600': darkMode && !selected,
          'bg-blue-50 border-blue-400 text-blue-800': selected && !darkMode,
          'bg-blue-800 border-blue-600 text-white': selected && darkMode,
          'opacity-50 cursor-not-allowed': disabled,
          'cursor-pointer hover:scale-[1.02]': !disabled,
        },
        className,
      )}
    >
      <FileIcon size={12} />
      <span className="flex items-center gap-1">
        <span>
          {value.status === 'success' ? value.data?.projectFile.name : '...'}
        </span>
        <span className="opacity-50">
          {`#${id}`}
        </span>
      </span>
      {selected && <CheckIcon size={12} />}
    </button>
  );
});
