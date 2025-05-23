import type { SdkSearchEngineT } from '@dashhub/sdk';

import { useAnimatedModal } from '@dashhub/commons-front';

import {
  SearchEngineUpdateFormModal,
  type SearchEngineUpdateFormModalProps,
} from './search-engine-update-form-modal';

type SearchEngineShowModalProps =
  & Pick<SearchEngineUpdateFormModalProps, 'onAfterSubmit'>
  & {
    app: SdkSearchEngineT;
  };

export function useSearchEngineUpdateModal() {
  return useAnimatedModal<boolean, SearchEngineShowModalProps>({
    renderModalContent: ({ showProps, hiding, onAnimatedClose }) => (
      <SearchEngineUpdateFormModal
        {...showProps}
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
