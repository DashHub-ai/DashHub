import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';

export function tapTaskEitherError<E, A>(fn: (data: E) => void) {
  return (task: TE.TaskEither<E, A>): TE.TaskEither<E, A> =>
    pipe(
      task,
      TE.fold(
        (error) => {
          fn(error);
          return TE.left(error);
        },
        data => TE.right(data),
      ),
    );
}
