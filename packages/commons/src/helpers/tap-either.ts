import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';

export function tapEither<E, A>(onRight: (data: A) => void, onLeft?: (error: E) => void) {
  return (task: E.Either<E, A>): E.Either<E, A> =>
    pipe(
      task,
      E.fold(
        (error) => {
          onLeft?.(error);
          return E.left(error);
        },
        (data) => {
          onRight(data);
          return E.right(data);
        },
      ),
    );
}
