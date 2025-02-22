import { useMemo } from 'react';

import type { SdkTableRowUuidT } from '~/shared';

import { useSdkSubscribePinnedMessagesOrThrow } from './use-sdk-subscribe-pinned-messages-or-throw';

export function useIsSdkPinnedMessageToggled(messageId: SdkTableRowUuidT) {
  const data = useSdkSubscribePinnedMessagesOrThrow();

  return useMemo(() => {
    if (data.loading) {
      return null;
    }

    return data.items.some(item => item.messageId === messageId);
  }, [data]);
}
