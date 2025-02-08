import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';

import type { SdkTableRowIdT } from '@llm/sdk';

import { useAsyncCallback } from '@llm/commons-front';
import { useSdkForLoggedIn } from '@llm/sdk';
import { selectChatFile } from '~/modules/chats/conversation/files/select-chat-file';
import { useSaveTaskEitherNotification } from '~/ui';

export function useFileUpload(projectId: SdkTableRowIdT) {
  const { sdks } = useSdkForLoggedIn();
  const saveNotifications = useSaveTaskEitherNotification();

  return useAsyncCallback(
    pipe(
      selectChatFile,
      TE.fromTaskOption(() => new Error('No file selected')),
      TE.chainW(file => pipe(
        sdks.dashboard.projectsFiles.upload({
          projectId,
          file,
        }),
        saveNotifications,
      )),
    ),
  );
}
