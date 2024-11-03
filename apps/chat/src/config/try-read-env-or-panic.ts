import { pipe } from 'fp-ts/lib/function';
import { fromError } from 'zod-validation-error';

import {
  panicError,
  tryOrThrowEither,
  tryParseUsingZodSchema,
  type UnparsedEnvObject,
} from '@llm/commons';

import { type ConfigT, ConfigV } from './config.dto';

export function tryReadEnvOrPanic() {
  const {
    VITE_APP_ENV,
    VITE_API_URL,
  } = import.meta.env ?? {};

  const config: UnparsedEnvObject<ConfigT> = {
    env: VITE_APP_ENV,
    apiUrl: VITE_API_URL,
  };

  return pipe(
    config,
    tryParseUsingZodSchema(ConfigV),
    tryOrThrowEither(error => panicError('Incorrect env config!')({
      config,
      error: fromError(error.context).toString(),
    })),
  );
}
