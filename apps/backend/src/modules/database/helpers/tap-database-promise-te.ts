import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import { DatabaseError } from '../errors';

export function tapDatabasePromiseTE<E, A, T>(fn: (data: A) => Promise<T>) {
  return (task: TE.TaskEither<E, A>) =>
    pipe(
      task,
      TE.tap(taskResult =>
        DatabaseError.tryTask(async () => fn(taskResult)),
      ),
    );
}
