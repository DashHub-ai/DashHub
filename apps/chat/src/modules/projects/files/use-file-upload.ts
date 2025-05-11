import { taskEither as TE, taskOption as TO } from 'fp-ts';
import { pipe } from 'fp-ts/function';

import type { SdkTableRowIdT } from '@dashhub/sdk';

import { tryOrThrowTE } from '@dashhub/commons';
import { useAsyncCallback } from '@dashhub/commons-front';
import { useSdkForLoggedIn } from '@dashhub/sdk';
import { selectChatFile } from '~/modules/chats/conversation/files/select-chat-file';
import { useSaveTaskEitherNotification } from '~/ui';

export function useFileUpload(projectId: SdkTableRowIdT) {
  const { sdks } = useSdkForLoggedIn();
  const saveNotifications = useSaveTaskEitherNotification();

  return useAsyncCallback(
    async (maybeFile?: File) => pipe(
      maybeFile
        ? TO.some(maybeFile)
        : selectChatFile,
      TE.fromTaskOption(() => new Error('No file selected')),
      TE.chainW(file => pipe(
        sdks.dashboard.projectsFiles.upload({
          projectId,
          file,
        }),
        saveNotifications,
      )),
      tryOrThrowTE,
    )(),
  );
}
