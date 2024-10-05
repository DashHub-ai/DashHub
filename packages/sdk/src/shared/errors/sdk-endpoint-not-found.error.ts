import { TaggedError } from '@llm/commons';

export class SdkEndpointNotFoundError extends TaggedError.ofLiteral()('SdkEndpointNotFoundError') {
  readonly httpCode = 404;
}
