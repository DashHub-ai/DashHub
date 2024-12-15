import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';

import type { SdkTableRowIdT } from '@llm/sdk';

import { selectFile } from '@llm/commons';
import { useAsyncCallback } from '@llm/commons-front';
import { useSdkForLoggedIn } from '@llm/sdk';

export function useFileUpload(projectId: SdkTableRowIdT) {
  const { sdks } = useSdkForLoggedIn();

  return useAsyncCallback(
    pipe(
      selectFile('*/*'),
      TE.fromTaskOption(() => new Error('No file selected')),
      TE.chainW(file => sdks.dashboard.projects.files.upload({
        projectId,
        file,
      })),
    ),
  );
}
