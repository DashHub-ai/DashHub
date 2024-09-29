import type { Env, MiddlewareHandler, ValidationTargets } from 'hono';
import type { z } from 'zod';

import { either as E } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { validator } from 'hono/validator';

import { tryParseUsingZodSchema } from '@llm/commons';
import { SdkInvalidRequestError } from '@llm/sdk';

import { respondWithTaggedError } from './respond-with-tagged-error';

export function sdkSchemaValidator<
  T extends z.ZodFirstPartySchemaTypes,
  const Target extends keyof ValidationTargets,
  E extends Env,
  P extends string,
  O = z.output<T>,
  V extends {
    in: any;
    out: { [K in Target]: O };
  } = {
    in: any;
    out: { [K in Target]: O };
  },
>(target: Target, schema: T): MiddlewareHandler<E, P, V> {
  const parser = tryParseUsingZodSchema(schema);

  return validator(target, (value, context) => {
    const result = parser(value);

    if (E.isLeft(result)) {
      return pipe(
        new SdkInvalidRequestError(result.left.context),
        respondWithTaggedError(context),
      );
    }

    return result.right as any;
  });
}
