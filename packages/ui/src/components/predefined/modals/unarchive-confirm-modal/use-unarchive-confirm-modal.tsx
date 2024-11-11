import { option as O, task as T } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import { useAnimatedModal } from '@llm/commons-front';

import {
  UnarchiveConfirmModal,
  type UnarchiveConfirmModalProps,
} from './unarchive-confirm-modal';

export function useUnarchiveConfirmModal() {
  const { show } = useAnimatedModal<
    any,
    Pick<UnarchiveConfirmModalProps, 'unarchiveItemsCount' | 'onConfirm'>
  >({
    renderModalContent: ({
      hiding,
      showProps: { onConfirm, ...attrs },
      onAnimatedClose,
    }) => (
      <UnarchiveConfirmModal
        {...attrs}
        isLeaving={hiding}
        onClose={() => {
          void onAnimatedClose();
        }}
        onConfirm={async () => {
          const result = await onConfirm();

          void onAnimatedClose(result);
        }}
      />
    ),
  });

  const execTaskIfConfirmed
    = (attrs: Pick<UnarchiveConfirmModalProps, 'unarchiveItemsCount'> = {}) =>
      <R extends object>(onConfirm: T.Task<R>) =>
        pipe(
          async () =>
            show({
              ...attrs,
              onConfirm,
            }) as Promise<R>,
          T.map(O.fromNullable),
        );

  return {
    show,
    execTaskIfConfirmed,
  };
}
