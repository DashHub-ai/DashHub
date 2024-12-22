import { pipe } from 'fp-ts/lib/function';
import { memo } from 'react';

import { isImageFileUrl, tryOrThrowTE } from '@llm/commons';
import { useAsyncValue } from '@llm/commons-front';
import {
  type SdkTableRowIdT,
  useSdkForLoggedIn,
} from '@llm/sdk';

export type ProjectImagesChatBadgeProps = {
  ids: SdkTableRowIdT[];
};

export const ProjectImagesChatBadge = memo(({ ids }: ProjectImagesChatBadgeProps) => {
  const { sdks } = useSdkForLoggedIn();
  const value = useAsyncValue(
    pipe(
      sdks.dashboard.projectsEmbeddings.search({
        limit: 15,
        offset: 0,
        sort: 'createdAt:asc',
        ids,
      }),
      tryOrThrowTE,
    ),
    [ids.join(',')],
  );

  if (value.status !== 'success') {
    return null;
  }

  const seenUrls = new Set<string>();
  const images = value.data.items.flatMap((result) => {
    const { projectFile } = result;
    const { publicUrl } = projectFile.resource;

    if (!isImageFileUrl(publicUrl) || seenUrls.has(publicUrl)) {
      return [];
    }

    seenUrls.add(publicUrl);
    const onClick = () => {
      window.open(publicUrl, '_blank');
    };

    return [
      <img
        key={projectFile.id}
        src={publicUrl}
        alt={projectFile.name}
        className="border-gray-200 shadow-sm border rounded-lg max-w-[150px] max-h-[150px] transition-transform cursor-pointer hover:scale-105 object-contain"
        onClick={onClick}
      />,
    ];
  });

  return (
    <div className="flex flex-row flex-wrap gap-4 empty:hidden my-4 mb-5">
      {images}
    </div>
  );
});
