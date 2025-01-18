import { AsyncTaskCache } from '@llm/commons';
import { useAsyncValue } from '@llm/commons-front';
import { type AppsSdk, type SdkAppT, type SdkTableRowIdT, useSdkForLoggedIn } from '@llm/sdk';

const APPS_CACHE = new AsyncTaskCache<SdkTableRowIdT, AppsSdk, SdkAppT>(
  (id, sdk) => sdk.get(id),
);

export function useCachedAppLookup(id: SdkTableRowIdT) {
  const { sdks } = useSdkForLoggedIn();

  return useAsyncValue(
    () => APPS_CACHE.get(id, sdks.dashboard.apps),
    [id],
    {
      initialValue: APPS_CACHE.getSyncValue(id),
    },
  );
}
