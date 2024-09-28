import { TaggedError } from '@llm/commons';

export class DatabaseRecordNotExists extends TaggedError.ofLiteral()('DatabaseRecordNotExists') {
  readonly httpCode = 404;
}
