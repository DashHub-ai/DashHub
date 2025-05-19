import { TaggedError } from '@dashhub/commons';

export class SdkRecordNotFoundError extends TaggedError.ofLiteral()('SdkRecordNotFoundError') {
  readonly httpCode = 404;
}
