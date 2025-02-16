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
import { useBalloon } from '~/ui';

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
  selected?: boolean;
  className?: string;
  disabled?: boolean;
};

export const ProjectEmbeddingChatBadge = memo((
  {
    id,
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
        'inline-flex relative items-center gap-1.5 px-2 py-1.5 rounded-md text-xs transition-all',
        {
          'bg-gray-100/50 text-gray-600 hover:bg-gray-200/70': !isOn,
          'bg-blue-100/50 text-blue-700': isOn,
          'opacity-50 cursor-not-allowed': disabled,
          'cursor-pointer hover:scale-105 active:scale-95': !disabled,
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
