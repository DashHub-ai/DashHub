import type { Context } from 'hono';

import type { TaggedError } from '@llm/commons';

export function respondWithTaggedError(
  context: Context,
  fallbackCode: number = 500,
) {
  return (result: TaggedError<string>) => context.json(
    {
      error: result.serialize(),
    },
    (result.httpCode ?? fallbackCode) as any,
  );
}
