import type { taskEither as TE } from 'fp-ts';

import { usePromiseCallback } from '@under-control/forms';
import { taskOption as TO } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import { useSaveTaskEitherNotification } from '~/ui/components/notifications';

import { useDeleteConfirmModal } from './use-delete-confirm-modal';

export type DeleteTE = TE.TaskEither<any, any>;

export type DeleteCallbackAttrs = {
  deleteItemsCount?: number;
  confirmAfterTask?: TO.TaskOption<any>;
};

export function useDeleteWithNotifications(
  onDeleteTask: DeleteTE,
  {
    confirmAfterTask,
    deleteItemsCount = 1,
  }: DeleteCallbackAttrs = {},
) {
  const { execTaskIfConfirmed } = useDeleteConfirmModal();
  const showSaveNotifications = useSaveTaskEitherNotification();

  return usePromiseCallback(
    pipe(
      confirmAfterTask ?? TO.some(true),
      TO.chain(() =>
        pipe(
          onDeleteTask,
          showSaveNotifications,
          execTaskIfConfirmed({ deleteItemsCount }),
        ),
      ),
    ),
  );
}
