import { TaggedError } from '@llm/commons';

export class SdkRecordNotFoundError extends TaggedError.ofLiteral()('SdkRecordNotFoundError') {
  readonly httpCode = 404;
}
