import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/function';

import type { TaggedError } from '@llm/commons';

import {
  isSdkTaggedError,
  SdkRecordAlreadyExistsError,
} from '@llm/sdk';
import { LoggerService } from '~/modules/logger';

export function rejectUnsafeCreateSdkErrors<T, E extends TaggedError<string, any>>(task: TE.TaskEither<E, T>) {
  const logger = LoggerService.of('rejectUnsafeSdkErrors');

  return pipe(
    task,
    TE.mapLeft((error) => {
      if (isSdkTaggedError(error)) {
        return error;
      }

      const mappedError = (() => {
        switch (error.tag) {
          case 'DatabaseRecordAlreadyExists':
            return new SdkRecordAlreadyExistsError({});

          default:
            return error;
        }
      })();

      if (mappedError !== error) {
        const { stack, ...context } = error;

        logger.error(`Mapped creator SDK error - ${error.tag}!`, context);

        if (stack) {
          console.error(stack);
        }
      }

      return mappedError;
    }),
  );
}
