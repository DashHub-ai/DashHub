import { memo } from 'react';

import { isImageFileUrl } from '@llm/commons';
import { useAsyncValue } from '@llm/commons-front';
import {
  type SdkTableRowIdT,
  useSdkForLoggedIn,
} from '@llm/sdk';

import { embeddingsChatsCache } from './project-embedding-chat-badge';

export type ProjectImageChatBadgeProps = {
  id: SdkTableRowIdT;
};

export const ProjectImageChatBadge = memo(({ id }: ProjectImageChatBadgeProps) => {
  const { sdks } = useSdkForLoggedIn();
  const value = useAsyncValue(
    () => embeddingsChatsCache.get(id, sdks.dashboard.projectsEmbeddings),
    [id],
    {
      initialValue: embeddingsChatsCache.getSyncValue(id),
    },
  );

  if (value.status !== 'success') {
    return null;
  }

  const { projectFile } = value.data;
  const { publicUrl } = projectFile.resource;

  const onClick = () => {
    window.open(publicUrl, '_blank');
  };

  if (!isImageFileUrl(publicUrl)) {
    return null;
  }

  return (
    <img
      src={publicUrl}
      alt={projectFile.name}
      className="border-gray-200 shadow-sm border rounded-lg max-w-[100px] max-h-[100px] transition-transform cursor-pointer hover:scale-105 object-contain"
      onClick={onClick}
    />
  );
});
