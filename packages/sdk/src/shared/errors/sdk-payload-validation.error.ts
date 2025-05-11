import { TaggedError } from '@dashhub/commons';

export class SdkPayloadValidationError extends TaggedError.ofLiteral<
  {
    errors: any[];
  }
>()('SdkPayloadValidationError') {}
