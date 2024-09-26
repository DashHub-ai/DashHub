import type { ZodFirstPartySchemaTypes } from 'zod';

import type { SyncStorageConfig } from './use-sync-storage-object';

import { useSyncStorageObject } from './use-sync-storage-object';

export function useLocalStorageObject<S extends ZodFirstPartySchemaTypes>(
  name: string,
  config: Omit<SyncStorageConfig<S>, 'storage'>,
) {
  return useSyncStorageObject<S>(
    name,
    {
      ...config,
      storage: localStorage,
    },
  );
}
