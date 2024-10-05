import { TaggedError } from '@llm/commons';

export class SdkInvalidJwtRefreshTokenError extends TaggedError.ofLiteral<any>()('SdkInvalidJwtRefreshTokenError') {
  readonly httpCode = 401;
}
