import type { Env, MiddlewareHandler, ValidationTargets } from 'hono';
import type { z } from 'zod';

import { either as E } from 'fp-ts';
import { validator } from 'hono/validator';

import type { SdkErrorResponseT } from '@llm/sdk';

import { tryParseUsingZodSchema } from '@llm/commons';

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

  return validator(target, (value, c) => {
    const result = parser(value);

    if (E.isLeft(result)) {
      const response: SdkErrorResponseT = {
        error: result.left.serialize(),
      };

      return c.json(response, 400);
    }

    return result.right as any;
  });
}
