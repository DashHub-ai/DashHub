import { ExternalLinkIcon } from 'lucide-react';

import type { SdkMessageWebSearchItemT } from '@dashhub/sdk';

import { useI18n } from '~/i18n';
import { BalloonButton } from '~/ui';

type WebSearchPreviewProps = {
  item: SdkMessageWebSearchItemT;
};

export function WebSearchPreview({ item }: WebSearchPreviewProps) {
  const { pack } = useI18n();

  return (
    <div className="flex flex-col gap-1.5 p-2">
      <div className="max-w-[320px] max-h-[150px] overflow-auto whitespace-break-spaces">
        <h3 className="mb-2 font-semibold">{item.title}</h3>
        <p className="text-gray-200 text-sm">{item.description}</p>
      </div>

      <div className="flex justify-center items-center gap-1.5 mt-2">
        <a href={item.url} target="_blank" rel="noreferrer">
          <BalloonButton as="span" className="font-semibold">
            <ExternalLinkIcon size={12} />
            {pack.buttons.open}
          </BalloonButton>
        </a>
      </div>
    </div>
  );
}
