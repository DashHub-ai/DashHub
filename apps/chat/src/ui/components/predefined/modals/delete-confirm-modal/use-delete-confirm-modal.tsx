import { option as O, task as T } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import { useAnimatedModal } from '@llm/commons-front';

import {
  DeleteConfirmModal,
  type DeleteConfirmModalProps,
} from './delete-confirm-modal';

export function useDeleteConfirmModal() {
  const { show } = useAnimatedModal<
    any,
    Pick<DeleteConfirmModalProps, 'deleteItemsCount' | 'onConfirm'>
  >({
    renderModalContent: ({
      hiding,
      showProps: { onConfirm, ...attrs },
      onAnimatedClose,
    }) => (
      <DeleteConfirmModal
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
    = (attrs: Pick<DeleteConfirmModalProps, 'deleteItemsCount'> = {}) =>
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
