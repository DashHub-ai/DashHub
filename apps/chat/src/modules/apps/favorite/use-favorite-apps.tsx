import { useMemo } from 'react';
import { z } from 'zod';

import { without } from '@llm/commons';
import { useLocalStorageObject } from '@llm/commons-front';
import { SdkTableRowIdV, type SdkTableRowWithIdT } from '@llm/sdk';

export function useFavoriteApps() {
  const storage = useLocalStorageObject('favorite-apps', {
    readBeforeMount: true,
    rerenderOnSet: true,
    schema: z.array(SdkTableRowIdV).catch([]),
  });

  const appsIds = useMemo(() => storage.getOrNull() || [], [storage.revision]);
  const hasFavorites = appsIds.length > 0;

  const isFavorite = (app: SdkTableRowWithIdT) => appsIds.includes(app.id);

  const toggle = (app: SdkTableRowWithIdT) => {
    const appsWithoutApp = without([app.id])(appsIds);

    if (!isFavorite(app)) {
      appsWithoutApp.push(app.id);
    }

    storage.set(appsWithoutApp);
  };

  return {
    total: appsIds.length,
    ids: appsIds,
    isFavorite,
    hasFavorites,
    toggle,
  };
}
