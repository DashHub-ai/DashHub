import { AsyncTaskCache } from '@llm/commons';
import { useAsyncValue } from '@llm/commons-front';
import {
  type AIExternalAPIsSdk,
  type SdkAIExternalApiT,
  type SdkTableRowIdT,
  useSdkForLoggedIn,
} from '@llm/sdk';

const APPS_CACHE = new AsyncTaskCache<SdkTableRowIdT, AIExternalAPIsSdk, SdkAIExternalApiT>(
  (id, sdk) => sdk.get(id),
);

export function useCachedExternalAIApiLookup(id: SdkTableRowIdT) {
  const { sdks } = useSdkForLoggedIn();

  return useAsyncValue(
    () => APPS_CACHE.get(id, sdks.dashboard.aiExternalAPIs),
    [id],
    {
      initialValue: APPS_CACHE.getSyncValue(id),
    },
  );
}
