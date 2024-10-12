import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/TaskEither';

import { DatabaseError } from '../errors/database.error';

export function chainDatabasePromiseTE<E, A, T>(fn: (data: A) => Promise<T>) {
  return (task: TE.TaskEither<E, A>) =>
    pipe(
      task,
      TE.chainW(taskResult => DatabaseError.tryTask(async () => fn(taskResult))),
    );
}
