import { TaggedError } from '@llm/commons';

export class SdkRecordAlreadyExistsError extends TaggedError.ofLiteral()('SdkRecordAlreadyExistsError') {}