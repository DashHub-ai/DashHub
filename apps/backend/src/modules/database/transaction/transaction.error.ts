import type { Task } from 'fp-ts/lib/Task';

import { taskEither as TE } from 'fp-ts';

import { TaggedError } from '@dashhub/commons';

export class TransactionError extends TaggedError.ofLiteral<any>()('TransactionError') {
  static tryTask<T>(task: Task<T>) {
    return TE.tryCatch(task, (err: any) => new TransactionError(err));
  }
}

export type TransactionTE<T> = TE.TaskEither<TransactionError, T>;
