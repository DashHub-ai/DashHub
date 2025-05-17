import type { z } from 'zod';

import { type either as E, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import { ValidationError } from '../errors/validation.error';

/**
 * Try to parse a value using a Zod schema.
 *
 * @param schema - The Zod schema to use.
 */
export function tryParseUsingZodSchema<S extends z.ZodType<unknown>>(schema: S) {
  return (value: unknown): E.Either<ValidationError, z.infer<S>> =>
    ValidationError.tryIO(() => schema.parse(value) as z.infer<S>);
}

/**
 * Try to parse a value using a Zod schema.
 *
 * @param schema - The Zod schema to use.
 */
export function tryParseUsingZodSchemaTE<S extends z.ZodType<unknown>>(schema: S) {
  return <E>(task: TE.TaskEither<any, E>): TE.TaskEither<ValidationError, z.infer<S>> =>
    pipe(task, TE.chainEitherKW(tryParseUsingZodSchema(schema)));
}

/**
 * Try to parse a value using a Zod schema asynchronously.
 *
 * @param schema - The Zod schema to use.
 */
export function tryParseUsingZodSchemaAsync<S extends z.ZodType<unknown>>(schema: S) {
  return (value: unknown): TE.TaskEither<ValidationError, z.infer<S>> =>
    TE.tryCatch(
      () => schema.parseAsync(value) as Promise<z.infer<S>>,
      (error: any) => new ValidationError(error),
    );
}
