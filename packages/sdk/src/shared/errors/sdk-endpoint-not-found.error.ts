import { TaggedError } from '@dashhub/commons';

export class SdkEndpointNotFoundError extends TaggedError.ofLiteral()('SdkEndpointNotFoundError') {
  readonly httpCode = 404;
}
