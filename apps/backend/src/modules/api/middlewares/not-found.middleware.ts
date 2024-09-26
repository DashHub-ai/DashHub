import type { Context } from 'hono';

import {
  type SdkErrorResponseT,
  SdkServerError,
} from '@llm/sdk';

export function notFoundMiddleware(context: Context<any, any>) {
  return context.json(
    {
      error: new SdkServerError(
        {
          message: '404 - Not found!',
        },
      ).serialize(),
    } satisfies SdkErrorResponseT,
    404,
  );
}
