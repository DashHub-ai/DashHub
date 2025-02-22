import { createContext } from 'react';

import type { StoreSubscriber } from '@llm/commons';
import type { PinnedMessagesSdk, SdkPinMessageListItemT } from '~/modules';

import { useContextOrThrow } from '@llm/commons-front';

export type SdkPinnedMessagesSnapshotT =
  | { loading: true; }
  | { loading: false; items: SdkPinMessageListItemT[]; };

export type SdkPinnedMessagesContextT =
  & StoreSubscriber<SdkPinnedMessagesSnapshotT>
  & {
    reload: ReturnType<PinnedMessagesSdk['all']>;
  };

export const SdkPinnedMessagesContext = createContext<SdkPinnedMessagesContextT | null>(null);

export const useSdkPinnedMessagesContextOrThrow = () => useContextOrThrow(SdkPinnedMessagesContext, 'Missing SDK PinnedMessages context in tree!');
