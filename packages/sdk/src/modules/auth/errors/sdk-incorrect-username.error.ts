import { TaggedError } from '@llm/commons';

export class SdkIncorrectUsernameError extends TaggedError.ofLiteral<
  {
    email: string;
  }
>()('SdkIncorrectUsernameError') {
  readonly httpCode = 401;
}
