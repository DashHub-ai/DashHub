import { TaggedError } from '@llm/commons';

export class SdkRequestError extends TaggedError.ofLiteral<any>()('SdkRequestError') {}
