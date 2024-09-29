import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import type { TaggedError } from '@llm/commons';

import { isSdkTaggedError, SdkRecordAlreadyExistsError, SdkRecordNotFoundError } from '@llm/sdk';
import { DatabaseRecordAlreadyExists, DatabaseRecordNotExists } from '~/modules/database';
import { LoggerService } from '~/modules/logger';

export function mapTagToSdkError<const ET extends string, RET extends TaggedError<`Sdk${string}`>>(
  catchTag: ET,
  mapper: (err: TaggedError<string>) => RET,
) {
  const logger = LoggerService.of('mapTagToSdkError');

  return <T, E extends TaggedError<string, any>>(
    task: Extract<E, TaggedError<ET>> extends never ? never : TE.TaskEither<E, T>,
  ) => pipe(
    task,
    TE.mapLeft((error) => {
      if (isSdkTaggedError(error) || error.tag !== catchTag) {
        return error;
      }

      const { stack, ...context } = error;

      logger.error(`Mapped creator SDK error - ${error.tag}!`, context);

      if (stack) {
        console.error(stack);
      }

      return mapper(error);
    }),
  ) as TE.TaskEither<Exclude<E, TaggedError<ET>> | RET, T>;
}

export const mapDbRecordAlreadyExistsToSdkError = mapTagToSdkError(
  DatabaseRecordAlreadyExists.tag,
  () => new SdkRecordAlreadyExistsError({}),
);

export const mapDbRecordNotFoundToSdkError = mapTagToSdkError(
  DatabaseRecordNotExists.tag,
  () => new SdkRecordNotFoundError({}),
);
