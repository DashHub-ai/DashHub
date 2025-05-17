import { TaggedError } from '@dashhub/commons';

export class SdkInvalidFileFormatError extends TaggedError.ofLiteral<{ name?: string; mimeType?: string; }>()('SdkInvalidFileFormatError') {
  readonly httpCode = 400;
}
