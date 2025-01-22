import clsx from 'clsx';
import { CheckIcon, FileIcon } from 'lucide-react';
import { memo } from 'react';

import { AsyncTaskCache, truncateText } from '@llm/commons';
import { useAsyncValue } from '@llm/commons-front';
import {
  type ProjectsEmbeddingsSdk,
  type SdkSearchProjectEmbeddingItemT,
  type SdkTableRowIdT,
  useSdkForLoggedIn,
} from '@llm/sdk';
import { useBalloon } from '@llm/ui';

import { ProjectEmbeddingPreview } from './project-embedding-preview';

export const embeddingsChatsCache = new AsyncTaskCache<
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
  disabled?: boolean;
};

export const ProjectEmbeddingChatBadge = memo((
  {
    id,
    darkMode,
    selected,
    className,
    disabled,
  }: ProjectEmbeddingChatBadgeProps,
) => {
  const { sdks } = useSdkForLoggedIn();
  const balloon = useBalloon<HTMLButtonElement>();
  const value = useAsyncValue(
    () => embeddingsChatsCache.get(id, sdks.dashboard.projectsEmbeddings),
    [id],
    {
      initialValue: embeddingsChatsCache.getSyncValue(id),
    },
  );

  const onToggleBallon = () => {
    if (value.status !== 'success') {
      return;
    }

    if (balloon.toggled) {
      balloon.hide();
      return;
    }

    void balloon.show(
      <ProjectEmbeddingPreview embedding={value.data} />,
    );
  };

  const isOn = selected || balloon.toggled;

  return (
    <button
      type="button"
      ref={balloon.targetRef}
      onClick={onToggleBallon}
      disabled={disabled}
      className={clsx(
        'inline-flex relative items-center gap-1 shadow-sm px-1 py-0.5 border rounded-md font-semibold text-[10px] transition-all',
        {
          'bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200 hover:border-gray-400': !darkMode && !isOn,
          'bg-gray-700 text-white border-gray-500 hover:bg-gray-600': darkMode && !isOn,
          'bg-blue-50 border-blue-400 text-blue-800': isOn && !darkMode,
          'bg-blue-800 border-blue-600 text-white': isOn && darkMode,
          'opacity-50 cursor-not-allowed': disabled,
          'cursor-pointer hover:scale-[1.02]': !disabled,
          'scale-[1.02]': isOn,
        },
        className,
      )}
    >
      <FileIcon size={10} />
      <span className="flex items-center gap-1">
        <span>
          {value.status === 'success' ? truncateText(25, '...')(value.data?.projectFile.name) : '...'}
        </span>
        <span className="opacity-50">
          {`#${id}`}
        </span>
      </span>
      {selected && <CheckIcon size={12} />}
    </button>
  );
});
