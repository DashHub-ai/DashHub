import * as TE from 'fp-ts/lib/TaskEither';

export function toVoidTE<E, A>(task: TE.TaskEither<E, A>): TE.TaskEither<E, void> {
  return TE.map(() => void 0)(task);
}
