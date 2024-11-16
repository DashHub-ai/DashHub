import { taskEither as TE } from 'fp-ts';

import { TaggedError } from '@llm/commons';

export class SdkUnauthorizedError extends TaggedError.ofLiteral<any>()('SdkUnauthorizedError') {
  readonly httpCode = 401;
}

export function ofSdkUnauthorizedErrorTE<T = unknown>() {
  return TE.left<SdkUnauthorizedError, T>(
    new SdkUnauthorizedError(null),
  );
}
