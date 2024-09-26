import type { TaskEither } from 'fp-ts/lib/TaskEither';

import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import * as T from 'fp-ts/lib/Task';

export function tryOrThrowTE<E, A>(taskEither: TaskEither<E, A>): T.Task<A> {
  return pipe(
    taskEither,
    T.map((either) => {
      if (E.isLeft(either)) {
        throw either.left;
      }

      return either.right;
    }),
  );
}
