import type { SdkCreateSearchEngineInputT } from '@dashhub/sdk';

import { useAnimatedModal } from '@dashhub/commons-front';
import { useWorkspaceOrganizationOrThrow } from '~/modules/workspace';

import {
  SearchEngineCreateFormModal,
  type SearchEngineCreateFormModalProps,
} from './search-engine-create-form-modal';

type SearchEngineShowModalProps =
  & Pick<SearchEngineCreateFormModalProps, 'onAfterSubmit'>
  & {
    defaultValue: Omit<SdkCreateSearchEngineInputT, 'organization'>;
  };

export function useSearchEngineCreateModal() {
  const { assignWorkspaceOrganization } = useWorkspaceOrganizationOrThrow();

  return useAnimatedModal<boolean, SearchEngineShowModalProps>({
    renderModalContent: ({ showProps: { defaultValue, ...showProps }, hiding, onAnimatedClose }) => (
      <SearchEngineCreateFormModal
        {...showProps}
        defaultValue={
          assignWorkspaceOrganization(defaultValue)
        }
        isLeaving={hiding}
        onAfterSubmit={() => {
          void onAnimatedClose(true);
          showProps?.onAfterSubmit?.();
        }}
        onClose={() => {
          void onAnimatedClose();
        }}
      />
    ),
  });
}
