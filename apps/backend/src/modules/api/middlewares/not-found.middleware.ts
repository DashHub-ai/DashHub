import type { Context } from 'hono';

import {
  type SdkErrorResponseT,
  SdkServerError,
} from '@llm/sdk';

export function notFoundMiddleware(context: Context<any, any>) {
  const error = new SdkServerError(
    {
      message: '404 - Not found!',
    },
  );

  return context.json(
    {
      error: error.serialize(),
    } satisfies SdkErrorResponseT,
    404,
  );
}
