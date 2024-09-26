import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';

export function tapTaskEitherErrorTE<A, E, E2 = E>(errorFnTE: (error: E) => TE.TaskEither<E2, any>) {
  return (task: TE.TaskEither<E, A>): TE.TaskEither<E | E2, A> =>
    pipe(
      task,
      TE.foldW(
        error =>
          pipe(
            error,
            errorFnTE,
            TE.foldW(
              rollbackErrors => TE.left(rollbackErrors),
              () => TE.left(error),
            ),
          ),
        TE.right,
      ),
    );
}
