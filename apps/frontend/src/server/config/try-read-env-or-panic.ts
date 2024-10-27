import process from 'node:process';

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
    APP_ENV,
    BASIC_AUTH_USERNAME,
    BASIC_AUTH_PASSWORD,
  } = process.env;

  const config: UnparsedEnvObject<ServerConfigT> = {
    env: APP_ENV,
    ...BASIC_AUTH_USERNAME && BASIC_AUTH_PASSWORD && {
      basicAuth: {
        username: BASIC_AUTH_USERNAME,
        password: BASIC_AUTH_PASSWORD,
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

// eslint-disable-next-line no-console
console.info('Config:', SERVER_CONFIG);

if (!isSSR()) {
  throw new Error('Are you crazy? Do not import this file in the browser!');
}
