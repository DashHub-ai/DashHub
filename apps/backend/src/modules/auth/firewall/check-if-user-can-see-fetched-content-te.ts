import type { Reader } from 'fp-ts/lib/Reader';

import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import {
  createAccessLevelGuard,
  ofSdkUnauthorizedErrorTE,
  type SdkAccessLevelGuards,
  type SdkJwtTokenT,
  type SdkUnauthorizedError,
} from '@llm/sdk';

export function checkIfUserCanSeeFetchedContentTE(token: SdkJwtTokenT) {
  const check = createAccessLevelGuard(token);

  return <A>(assertFn: Reader<IsAuthorizedReaderAttrs & { result: A; }, boolean>) =>
    <E>(task: TE.TaskEither<E, A>) =>
      pipe(
        task,
        TE.chainW((result): TE.TaskEither<E | SdkUnauthorizedError, A> => {
          if (!check.is.root && !assertFn({ result, token, check })) {
            return ofSdkUnauthorizedErrorTE();
          }

          return TE.right(result);
        }),
      );
}

type IsAuthorizedReaderAttrs = {
  token: SdkJwtTokenT;
  check: SdkAccessLevelGuards;
};
