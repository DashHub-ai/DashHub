import { DownloadIcon } from 'lucide-react';
import Markdown from 'react-markdown';

import type { SdkSearchProjectEmbeddingItemT } from '@llm/sdk';

import { BalloonButton } from '@llm/ui';
import { useI18n } from '~/i18n';

type ProjectEmbeddingPreviewProps = {
  embedding: SdkSearchProjectEmbeddingItemT;
};

export function ProjectEmbeddingPreview({ embedding }: ProjectEmbeddingPreviewProps) {
  const { pack } = useI18n();

  return (
    <div className="flex flex-col gap-1.5 p-2">
      <div className="relative">
        <div className="max-w-[320px] max-h-[150px] whitespace-break-spaces overflow-auto">
          <strong>...</strong>
          <Markdown>{embedding.text}</Markdown>
          <strong>...</strong>
        </div>
      </div>

      <div className="flex justify-center items-center gap-1.5">
        <a href={embedding.projectFile.resource.publicUrl} target="_blank" rel="noreferrer">
          <BalloonButton as="span" className="font-semibold">
            <DownloadIcon size={12} />
            {pack.buttons.download}
          </BalloonButton>
        </a>
      </div>
    </div>
  );
}
