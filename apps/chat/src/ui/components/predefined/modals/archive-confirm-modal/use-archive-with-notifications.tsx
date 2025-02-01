import type { taskEither as TE } from 'fp-ts';

import { usePromiseCallback } from '@under-control/forms';
import { taskOption as TO } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import { useSaveTaskEitherNotification } from '~/ui/components/notifications';

import { useArchiveConfirmModal } from './use-archive-confirm-modal';

export type ArchiveTE = TE.TaskEither<any, any>;

export type ArchiveCallbackAttrs = {
  archiveItemsCount?: number;
  confirmAfterTask?: TO.TaskOption<any>;
};

export function useArchiveWithNotifications(
  onArchiveTask: ArchiveTE,
  {
    confirmAfterTask,
    archiveItemsCount = 1,
  }: ArchiveCallbackAttrs = {},
) {
  const { execTaskIfConfirmed } = useArchiveConfirmModal();
  const showSaveNotifications = useSaveTaskEitherNotification();

  return usePromiseCallback(
    pipe(
      confirmAfterTask ?? TO.some(true),
      TO.chain(() =>
        pipe(
          onArchiveTask,
          showSaveNotifications,
          execTaskIfConfirmed({ archiveItemsCount }),
        ),
      ),
    ),
  );
}
