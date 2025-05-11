import { TaggedError } from '@dashhub/commons';

export class DatabaseRecordNotExists extends TaggedError.ofLiteral()('DatabaseRecordNotExists') {
  readonly httpCode = 404;
}
