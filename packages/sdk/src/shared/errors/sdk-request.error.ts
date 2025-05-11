import { TaggedError } from '@dashhub/commons';

export class SdkRequestError extends TaggedError.ofLiteral<any>()('SdkRequestError') {}
