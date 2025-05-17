import { DownloadIcon } from 'lucide-react';
import Markdown from 'react-markdown';

import type { SdkSearchProjectEmbeddingItemT } from '@dashhub/sdk';

import { isImageFileUrl } from '@dashhub/commons';
import { useI18n } from '~/i18n';
import { BalloonButton } from '~/ui';

type ProjectEmbeddingPreviewProps = {
  embedding: SdkSearchProjectEmbeddingItemT;
};

export function ProjectEmbeddingPreview({ embedding }: ProjectEmbeddingPreviewProps) {
  const { pack } = useI18n();
  const { publicUrl } = embedding.projectFile.resource;

  return (
    <div className="flex flex-col gap-1.5 p-2">
      <div className="relative flex flex-row items-center gap-4">
        {isImageFileUrl(publicUrl) && (
          <img
            src={publicUrl}
            alt={embedding.projectFile.name}
            className="mx-auto mb-2 rounded-lg max-w-[120px] max-h-[120px] object-contain"
          />
        )}

        <div className="max-w-[320px] max-h-[150px] overflow-auto whitespace-break-spaces">
          <strong>...</strong>
          <Markdown>{embedding.text}</Markdown>
          <strong>...</strong>
        </div>
      </div>

      <div className="flex justify-center items-center gap-1.5">
        <a href={publicUrl} target="_blank" rel="noreferrer">
          <BalloonButton as="span" className="font-semibold">
            <DownloadIcon size={12} />
            {pack.buttons.download}
          </BalloonButton>
        </a>
      </div>
    </div>
  );
}
