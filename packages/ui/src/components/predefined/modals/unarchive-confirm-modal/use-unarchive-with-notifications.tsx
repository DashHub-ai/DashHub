import type { taskEither as TE } from 'fp-ts';

import { usePromiseCallback } from '@under-control/forms';
import { taskOption as TO } from 'fp-ts';
import { pipe } from 'fp-ts/function';

import { useSaveTaskEitherNotification } from '~/components/notifications';

import { useUnarchiveConfirmModal } from './use-unarchive-confirm-modal';

export type UnarchiveTE = TE.TaskEither<any, any>;

export type UnarchiveCallbackAttrs = {
  unarchiveItemsCount?: number;
  confirmAfterTask?: TO.TaskOption<any>;
};

export function useUnarchiveWithNotifications(
  onUnarchiveTask: UnarchiveTE,
  {
    confirmAfterTask,
    unarchiveItemsCount = 1,
  }: UnarchiveCallbackAttrs = {},
) {
  const { execTaskIfConfirmed } = useUnarchiveConfirmModal();
  const showSaveNotifications = useSaveTaskEitherNotification();

  return usePromiseCallback(
    pipe(
      confirmAfterTask ?? TO.some(true),
      TO.chain(() =>
        pipe(
          onUnarchiveTask,
          showSaveNotifications,
          execTaskIfConfirmed({ unarchiveItemsCount }),
        ),
      ),
    ),
  );
}
