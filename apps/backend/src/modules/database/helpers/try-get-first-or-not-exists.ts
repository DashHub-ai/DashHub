import { array as A, taskEither as TE } from 'fp-ts';
import { flow, pipe } from 'fp-ts/function';

import { DatabaseRecordNotExists } from '../errors';

export function tryGetFirstOrNotExists<E, A>(task: TE.TaskEither<E | DatabaseRecordNotExists, A[]>) {
  return pipe(
    task,
    TE.chainW(
      flow(
        A.head,
        TE.fromOption(() => new DatabaseRecordNotExists({})),
      ),
    ),
  );
}
