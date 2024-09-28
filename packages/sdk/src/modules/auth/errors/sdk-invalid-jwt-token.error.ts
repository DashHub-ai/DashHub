import { TaggedError } from '@llm/commons';

export class SdkInvalidJwtTokenError extends TaggedError.ofLiteral<any>()('SdkInvalidJwtTokenError') {
  readonly httpCode = 401;
}
