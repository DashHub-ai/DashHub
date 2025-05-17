import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import type { TaggedError } from '@dashhub/commons';

import {
  isSdkTaggedError,
  SdkServerError,
} from '@dashhub/sdk';
import { LoggerService } from '~/modules/logger';

export function rejectUnsafeSdkErrors<T, E extends TaggedError<string, any>>(task: TE.TaskEither<E, T>) {
  const logger = LoggerService.of('rejectUnsafeSdkErrors');

  return pipe(
    task,
    TE.mapLeft((error) => {
      if (isSdkTaggedError(error)) {
        return error;
      }

      const { stack, ...context } = error;

      logger.error(`Rejected unsafe SDK error - ${error.tag}!`, context);
      console.error(error.context);

      if (stack) {
        console.error(stack);
      }

      return new SdkServerError({
        message: 'Internal server error!',
      });
    }),
  );
}
