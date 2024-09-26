import type { IO } from 'fp-ts/lib/IO';
import type { ZodError } from 'zod';

import * as E from 'fp-ts/lib/Either';

import { TaggedError } from './tagged-error';

export class ValidationError extends TaggedError.ofLiteral<ZodError>()('ValidationError') {
  static tryIO<T>(task: IO<T>) {
    return E.tryCatch(task, (err: any) => new ValidationError(err));
  }
}
