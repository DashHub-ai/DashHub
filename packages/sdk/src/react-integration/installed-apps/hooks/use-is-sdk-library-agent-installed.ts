import { useMemo } from 'react';

import type { SdkTableRowWithUuidT } from '~/shared';

import { useSdkSubscribeInstalledAppsOrThrow } from './use-sdk-subscribe-installed-apps-or-throw';

export function useIsSdkLibraryAgentInstalled(agent: SdkTableRowWithUuidT) {
  const data = useSdkSubscribeInstalledAppsOrThrow();

  return useMemo(() => {
    if (data.loading) {
      return null;
    }

    return data.items.find(item => item.libraryAgent.id === agent.id);
  }, [data, agent.id]);
}
