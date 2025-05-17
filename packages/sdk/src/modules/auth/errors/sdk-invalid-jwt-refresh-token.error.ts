import { TaggedError } from '@dashhub/commons';

export class SdkInvalidJwtRefreshTokenError extends TaggedError.ofLiteral<any>()('SdkInvalidJwtRefreshTokenError') {
  readonly httpCode = 401;
}
