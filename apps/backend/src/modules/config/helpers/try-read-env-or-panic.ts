import process from 'node:process';

import dotenv from 'dotenv';
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
  const envFile = dotenv.config();
  const {
    // BASE
    APP_ENV,
    APP_ENDUSER_DOMAIN,

    // HTTP
    SERVER_HOST,
    SERVER_PORT,

    // DB
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_NAME,
    DATABASE_USER,
    DATABASE_PASSWORD,
    DATABASE_CHECK_MIGRATIONS_ON_STARTUP,

    // ES
    ELASTICSEARCH_HOST,
    ELASTICSEARCH_PORT,
    ELASTICSEARCH_USER,
    ELASTICSEARCH_PASSWORD,
    ELASTICSEARCH_SYNC_MAPPINGS_ON_STARTUP,
    ELASTICSEARCH_SYNC_MAPPINGS_CRON,

    // Users
    USER_ROOT_EMAIL,
    USER_ROOT_PASSWORD,

    // Auth
    JWT_SECRET,
    JWT_EXPIRES_IN,
  } = {
    ...envFile.parsed,
    ...process.env,
  };

  const config: UnparsedEnvObject<ConfigT> = {
    env: APP_ENV,
    endUserDomain: APP_ENDUSER_DOMAIN,
    listen: {
      hostname: SERVER_HOST,
      port: SERVER_PORT,
    },
    elasticsearch: {
      hostname: ELASTICSEARCH_HOST,
      port: ELASTICSEARCH_PORT,
      syncMappings: {
        onStartup: ELASTICSEARCH_SYNC_MAPPINGS_ON_STARTUP,
        cron: ELASTICSEARCH_SYNC_MAPPINGS_CRON,
      },

      ...ELASTICSEARCH_USER && ELASTICSEARCH_PASSWORD && {
        auth: {
          user: ELASTICSEARCH_USER,
          password: ELASTICSEARCH_PASSWORD,
        },
      },
    },
    database: {
      hostname: DATABASE_HOST,
      port: DATABASE_PORT,
      name: DATABASE_NAME,
      user: DATABASE_USER,
      password: DATABASE_PASSWORD,
      migration: {
        checkMigrationsOnStartup: DATABASE_CHECK_MIGRATIONS_ON_STARTUP,
      },
    },
    users: {
      root: {
        email: USER_ROOT_EMAIL,
        password: USER_ROOT_PASSWORD,
      },
    },
    auth: {
      jwt: {
        secret: JWT_SECRET,
        expiresIn: JWT_EXPIRES_IN,
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
