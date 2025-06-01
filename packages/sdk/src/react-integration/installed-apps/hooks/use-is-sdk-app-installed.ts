import { useMemo } from 'react';

import type { SdkTableRowWithIdT } from '~/shared';

import { useSdkSubscribeInstalledAppsOrThrow } from './use-sdk-subscribe-installed-apps-or-throw';

export function useIsSdkAppInstalled(app: SdkTableRowWithIdT) {
  const data = useSdkSubscribeInstalledAppsOrThrow();

  return useMemo(() => {
    if (data.loading) {
      return null;
    }

    return data.items.some(item => item.app.id === app.id);
  }, [data, app.id]);
}
