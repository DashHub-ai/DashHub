import { StrictBooleanV } from '@llm/commons';
import { useLocalStorageObject } from '@llm/commons-front';

export function useSidebarToggledStorage() {
  return useLocalStorageObject('toggled-page-layout-sidebar', {
    forceParseIfNotSet: true,
    schema: StrictBooleanV.catch(true),
    readBeforeMount: true,
  });
}
