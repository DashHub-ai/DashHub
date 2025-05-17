import { TaggedError } from '@dashhub/commons';

export class SdkIncorrectUsernameOrPasswordError extends TaggedError.ofLiteral<
  {
    email: string;
  }
>()('SdkIncorrectUsernameOrPasswordError') {
  readonly httpCode = 401;
}
