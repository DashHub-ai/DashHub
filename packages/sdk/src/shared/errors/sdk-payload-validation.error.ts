import { TaggedError } from '@llm/commons';

export class SdkPayloadValidationError extends TaggedError.ofLiteral<
  {
    errors: any[];
  }
>()('SdkPayloadValidationError') {}
