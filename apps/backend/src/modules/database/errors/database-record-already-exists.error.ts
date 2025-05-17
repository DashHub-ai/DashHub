import { TaggedError } from '@dashhub/commons';

export class DatabaseRecordAlreadyExists extends TaggedError.ofLiteral()('DatabaseRecordAlreadyExists') {
  readonly httpCode = 409;
}
