import { TaggedError } from '@dashhub/commons';

export class SdkIncorrectUsernameError extends TaggedError.ofLiteral<
  {
    email: string;
  }
>()('SdkIncorrectUsernameError') {
  readonly httpCode = 401;
}
