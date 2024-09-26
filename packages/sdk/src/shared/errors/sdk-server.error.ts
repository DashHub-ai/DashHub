import { TaggedError } from '@llm/commons';

export class SdkServerError extends TaggedError.ofLiteral<
  {
    message: string;
  }
>()('SdkServerError') {}
