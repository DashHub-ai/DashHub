import { TaggedError } from '@llm/commons';

export class SdkIncorrectUsernameOrPasswordError extends TaggedError.ofLiteral<
  {
    email: string;
  }
>()('SdkIncorrectUsernameOrPasswordError') {
  readonly httpCode = 401;
}
