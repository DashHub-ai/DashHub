import { useCallback, useMemo } from 'react';
import { z } from 'zod';

import { useLocalStorageObject } from '@dashhub/commons-front';

const SectionStatesSchema = z.record(z.string(), z.boolean());

export function useSidebarSectionsStorage() {
  const sectionsStatesStorage = useLocalStorageObject(
    'sidebar-sections-expanded-state',
    {
      forceParseIfNotSet: true,
      schema: SectionStatesSchema.catch({}),
      readBeforeMount: true,
    },
  );

  const toggleSection = useCallback((id: string) => {
    const currentValue = sectionsStatesStorage.getOrNull()?.[id];
    const newState = {
      ...sectionsStatesStorage.getOrNull(),
      [id]: currentValue === false,
    };

    sectionsStatesStorage.set(newState);
  }, [sectionsStatesStorage]);

  const sectionsState = useMemo(() =>
    sectionsStatesStorage.getOrNull() || {}, [sectionsStatesStorage]);

  return {
    toggleSection,
    isSectionExpanded: (id: string): boolean | undefined => sectionsState[id],
  };
}
