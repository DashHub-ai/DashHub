import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';

export function tapTaskEither<E, A>(onRight: (data: A) => void, onLeft?: (error: E) => void) {
  return (task: TE.TaskEither<E, A>): TE.TaskEither<E, A> =>
    pipe(
      task,
      TE.fold(
        (error) => {
          onLeft?.(error);
          return TE.left(error);
        },
        (data) => {
          onRight(data);
          return TE.right(data);
        },
      ),
    );
}

export function tapTaskEitherTE<E, A, R>(fn: (data: A) => TE.TaskEither<E, R>) {
  return <E2>(task: TE.TaskEither<E2, A>): TE.TaskEither<E | E2, A> =>
    pipe(task, TE.chainFirstW(fn));
}
