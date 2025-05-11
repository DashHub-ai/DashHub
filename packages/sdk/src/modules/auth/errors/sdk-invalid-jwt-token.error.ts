import { TaggedError } from '@dashhub/commons';

export class SdkInvalidJwtTokenError extends TaggedError.ofLiteral<any>()('SdkInvalidJwtTokenError') {
  readonly httpCode = 401;
}
