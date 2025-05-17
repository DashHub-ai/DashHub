import { createContext } from 'react';

import type { StoreSubscriber } from '@dashhub/commons';
import type { SdkUserT, UsersMeSdk } from '~/modules';

import { useContextOrThrow } from '@dashhub/commons-front';

export type SdkMeSnapshotT =
  | { loading: true; }
  | { loading: false; me: SdkUserT; };

export type SdkMeContextT =
  & StoreSubscriber<SdkMeSnapshotT>
  & {
    reload: ReturnType<UsersMeSdk['get']>;
  };

export const SdkMeContext = createContext<SdkMeContextT | null>(null);

export const useSdkMeContextOrThrow = () => useContextOrThrow(SdkMeContext, 'Missing SDK Me context in tree!');
