import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/function';

import type { TaggedError } from '@llm/commons';

import { isSdkTaggedError, SdkServerError } from '@llm/sdk';
import { LoggerService } from '~/modules/logger';

export function rejectUnsafeSdkErrors<T, E extends TaggedError<string, any>>(task: TE.TaskEither<E, T>) {
  const logger = LoggerService.of('rejectUnsafeSdkErrors');

  return pipe(
    task,
    TE.mapLeft((error) => {
      if (!isSdkTaggedError(error)) {
        logger.error(`Rejected unsafe SDK error - ${error.tag}!`, error.context);

        return new SdkServerError({
          message: 'Internal server error!',
        });
      }

      return error;
    }),
  );
}
