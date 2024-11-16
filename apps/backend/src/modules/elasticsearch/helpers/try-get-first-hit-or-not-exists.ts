import {
  array as A,
  either as E,
  taskEither as TE,
} from 'fp-ts';
import { pipe } from 'fp-ts/function';

import type { EsHitSource, EsHitsResponse } from '../elasticsearch.type';

import { EsDocumentNotFoundError } from '../elasticsearch.error';

export function tryGetFirstHitOrNotExists<A>(items: A[]): E.Either<EsDocumentNotFoundError, A> {
  return pipe(
    items,
    A.head,
    E.fromOption(() => new EsDocumentNotFoundError({})),
  );
}

export function tryGetFirstRawResponseHitOrNotExists<
  E,
  A extends EsHitSource,
>(task: TE.TaskEither<E | EsDocumentNotFoundError, EsHitsResponse<A>>) {
  return pipe(
    task,
    TE.map(({ hits }) => hits.hits),
    TE.chainEitherKW(tryGetFirstHitOrNotExists),
  );
}

export function tryGetFirstPaginationHitOrNotExists<E, A>(
  task: TE.TaskEither<E | EsDocumentNotFoundError, { items: A[]; }>,
) {
  return pipe(
    task,
    TE.map(({ items }) => items),
    TE.chainEitherKW(tryGetFirstHitOrNotExists),
  );
}
