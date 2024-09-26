import type { Either } from 'fp-ts/lib/Either';

import * as E from 'fp-ts/lib/Either';

/**
 * Try to get the value from an Either or throw an error.
 *
 * @param mapError - The function to map the error to an error to throw.
 * @returns A function that takes an Either and returns the value if it is a Right or throws an error if it is a Left.
 */
export function tryOrThrowEither<E>(mapError: (error: E) => any) {
  return <A>(either: Either<E, A>): A => {
    if (E.isLeft(either)) {
      throw mapError(either.left);
    }

    return either.right;
  };
}
