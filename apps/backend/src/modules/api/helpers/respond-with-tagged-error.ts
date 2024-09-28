import type { Context } from 'hono';

import type { TaggedError } from '@llm/commons';

export function respondWithTaggedError(
  context: Context,
  result: TaggedError<string>,
  fallbackCode: number = 500,
) {
  return context.json(
    {
      error: result.serialize(),
    },
    (result.httpCode ?? fallbackCode) as any,
  );
}
