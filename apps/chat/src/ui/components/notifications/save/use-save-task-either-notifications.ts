import type { TaskEither } from 'fp-ts/TaskEither';

import { pipe } from 'fp-ts/lib/function';

import { type TaggedError, tapTaskEither } from '@dashhub/commons';

import { useSaveErrorNotification } from './use-save-error-notification';
import { useSaveSuccessNotification } from './use-save-success-notification';

export function useSaveTaskEitherNotification() {
  const success = useSaveSuccessNotification();
  const error = useSaveErrorNotification();

  return <E extends TaggedError<string>, A>(task: TaskEither<E, A>): TaskEither<E, A> =>
    pipe(
      task,
      tapTaskEither<E, A>(success, error),
    );
}
