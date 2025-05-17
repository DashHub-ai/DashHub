import { StrictBooleanV } from '@dashhub/commons';
import { useLocalStorageObject } from '@dashhub/commons-front';

export function useSidebarToggledStorage() {
  return useLocalStorageObject('toggled-page-layout-sidebar', {
    forceParseIfNotSet: true,
    schema: StrictBooleanV.catch(true),
    readBeforeMount: true,
  });
}
