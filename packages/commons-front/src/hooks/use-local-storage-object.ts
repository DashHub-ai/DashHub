import type { z } from 'zod';

import type { SyncStorageConfig } from './use-sync-storage-object';

import { useSyncStorageObject } from './use-sync-storage-object';

export function useLocalStorageObject<S extends z.ZodType<unknown>>(
  name: string,
  config: Omit<SyncStorageConfig<S>, 'storage'>,
) {
  return useSyncStorageObject<S>(
    name,
    {
      ...config,
      storage: window.localStorage,
    },
  );
}
