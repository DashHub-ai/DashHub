import { TaggedError } from '@llm/commons';

export class DatabaseRecordAlreadyExists extends TaggedError.ofLiteral()('DatabaseRecordAlreadyExists') {
  readonly httpCode = 403;
}
