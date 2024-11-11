import { option as O, task as T } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import { useAnimatedModal } from '@llm/commons-front';

import {
  ArchiveConfirmModal,
  type ArchiveConfirmModalProps,
} from './archive-confirm-modal';

export function useArchiveConfirmModal() {
  const { show } = useAnimatedModal<
    any,
    Pick<ArchiveConfirmModalProps, 'archiveItemsCount' | 'onConfirm'>
  >({
    renderModalContent: ({
      hiding,
      showProps: { onConfirm, ...attrs },
      onAnimatedClose,
    }) => (
      <ArchiveConfirmModal
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
    = (attrs: Pick<ArchiveConfirmModalProps, 'archiveItemsCount'> = {}) =>
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
