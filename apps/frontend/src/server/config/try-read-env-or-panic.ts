import { pipe } from 'fp-ts/lib/function';
import { fromError } from 'zod-validation-error';

import {
  isSSR,
  panicError,
  tryOrThrowEither,
  tryParseUsingZodSchema,
  type UnparsedEnvObject,
} from '@llm/commons';

import { type ServerConfigT, ServerConfigV } from './server-config.dto';

export function tryReadEnvOrPanic() {
  const {
    VITE_APP_ENV,
    SECRET_BASIC_AUTH_USERNAME,
    SECRET_BASIC_AUTH_PASSWORD,
  } = import.meta.env ?? {};

  const config: UnparsedEnvObject<ServerConfigT> = {
    env: VITE_APP_ENV,
    ...SECRET_BASIC_AUTH_USERNAME && SECRET_BASIC_AUTH_PASSWORD && {
      basicAuth: {
        username: SECRET_BASIC_AUTH_USERNAME,
        password: SECRET_BASIC_AUTH_PASSWORD,
      },
    },
  };

  return pipe(
    config,
    tryParseUsingZodSchema(ServerConfigV),
    tryOrThrowEither(error => panicError('Incorrect env config!')({
      config,
      error: fromError(error.context).toString(),
    })),
  );
}

export const SERVER_CONFIG = tryReadEnvOrPanic();

if (!isSSR()) {
  throw new Error('Are you crazy? Do not import this file in the browser!');
}
