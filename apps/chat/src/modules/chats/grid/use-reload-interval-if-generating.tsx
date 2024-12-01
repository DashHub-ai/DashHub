import { useMemo } from 'react';

import { useInterval } from '@llm/commons-front';
import { isSdkAIGeneratingString, type SdKSearchChatsOutputT } from '@llm/sdk';

export function useReloadIntervalIfGenerating(
  reload: VoidFunction,
  pagination: SdKSearchChatsOutputT | null,
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

  useInterval(reload, isGenerating ? 2000 : 7000);
}
