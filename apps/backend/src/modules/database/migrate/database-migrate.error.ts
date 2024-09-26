import type { Task } from 'fp-ts/lib/Task';

import { taskEither as TE } from 'fp-ts';

import { TaggedError } from '@llm/commons';

export class DatabaseMigrateError extends TaggedError.ofLiteral()('DatabaseMigrateError') {
  static tryTask<T>(task: Task<T>) {
    return TE.tryCatch(task, (err: any) => new DatabaseMigrateError(err));
  }
}
