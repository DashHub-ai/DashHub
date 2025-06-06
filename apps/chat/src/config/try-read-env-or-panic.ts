import { pipe } from 'fp-ts/lib/function';
import { fromError } from 'zod-validation-error';

import {
  panicError,
  tryOrThrowEither,
  tryParseUsingZodSchema,
  type UnparsedEnvObject,
} from '@dashhub/commons';

import { type ConfigT, ConfigV } from './config.dto';

export function tryReadEnvOrPanic() {
  const {
    PUBLIC_VITE_APP_ENV,
    PUBLIC_VITE_API_URL,
    PUBLIC_VITE_GOOGLE_DRIVE_CLIENT_ID,
  } = import.meta.env ?? {};

  const config: UnparsedEnvObject<ConfigT> = {
    env: PUBLIC_VITE_APP_ENV,
    apiUrl: PUBLIC_VITE_API_URL,

    ...PUBLIC_VITE_GOOGLE_DRIVE_CLIENT_ID && {
      googleDrive: {
        clientId: PUBLIC_VITE_GOOGLE_DRIVE_CLIENT_ID,
      },
    },
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
