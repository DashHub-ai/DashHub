import type { Context } from 'hono';

import {
  SdkEndpointNotFoundError,
  type SdkErrorResponseT,
} from '@llm/sdk';

export function notFoundMiddleware(context: Context<any, any>) {
  const error = new SdkEndpointNotFoundError(
    {
      message: '404 - Not found!',
    },
  );

  return context.json(
    {
      error: error.serialize(),
    } satisfies SdkErrorResponseT,
    error.httpCode,
  );
}
