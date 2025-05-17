import { useMemo } from 'react';

import { useInterval } from '@dashhub/commons-front';
import { isSdkAIGeneratingString, type SdkSearchChatsOutputT } from '@dashhub/sdk';

export function useReloadIntervalIfGenerating(
  reload: VoidFunction,
  pagination: SdkSearchChatsOutputT | null,
  disable?: boolean,
) {
  const isGenerating = useMemo(() => {
    if (!pagination) {
      return false;
    }

    return pagination.items.some(({ summary }) =>
      isSdkAIGeneratingString(summary.name)
      || isSdkAIGeneratingString(summary.content),
    );
  }, [pagination]);

  useInterval(reload, isGenerating ? 2000 : 7000, {
    disable,
  });
}
