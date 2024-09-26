import type { z, ZodFirstPartySchemaTypes } from 'zod';

import { type either as E, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import { ValidationError } from '../errors/validation.error';

/**
 * Try to parse a value using a Zod schema.
 *
 * @param schema - The Zod schema to use.
 */
export function tryParseUsingZodSchema<S extends ZodFirstPartySchemaTypes>(schema: S) {
  return (value: unknown): E.Either<ValidationError, z.infer<S>> =>
    ValidationError.tryIO(() => schema.parse(value) as z.infer<S>);
}

/**
 * Try to parse a value using a Zod schema.
 *
 * @param schema - The Zod schema to use.
 */
export function tryParseUsingZodSchemaTE<S extends ZodFirstPartySchemaTypes>(schema: S) {
  return <E>(task: TE.TaskEither<any, E>): TE.TaskEither<ValidationError, z.infer<S>> =>
    pipe(task, TE.chainEitherKW(tryParseUsingZodSchema(schema)));
}
