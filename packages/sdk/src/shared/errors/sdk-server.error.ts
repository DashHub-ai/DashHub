import { TaggedError } from '@dashhub/commons';

export class SdkServerError extends TaggedError.ofLiteral<
  {
    message: string;
  }
>()('SdkServerError') {}
