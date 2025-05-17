import { TaggedError } from '@dashhub/commons';

export class SdkRecordAlreadyExistsError extends TaggedError.ofLiteral()('SdkRecordAlreadyExistsError') {
  readonly httpCode = 409;
}
