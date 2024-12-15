import { TaggedError } from '@llm/commons';

export class SdkInvalidFileFormatError extends TaggedError.ofLiteral<{ mimeType?: string; }>()('SdkInvalidFileFormatError') {
  readonly httpCode = 400;
}
