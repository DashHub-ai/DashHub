import type { ZodError } from 'zod';

import { TaggedError } from '@dashhub/commons';

export class SdkInvalidRequestError extends TaggedError.ofLiteral<ZodError>()('SdkInvalidRequestError') {
  readonly httpCode = 400;
}
