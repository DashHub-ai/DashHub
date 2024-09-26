import type { Task } from 'fp-ts/lib/Task';

import { taskEither as TE } from 'fp-ts';

import { TaggedError } from '@llm/commons';

export class DatabaseError extends TaggedError.ofLiteral()('DatabaseError') {
  static tryTask<T>(task: Task<T>) {
    return TE.tryCatch(task, (err: any) => new DatabaseError(err));
  }
}

export type DatabaseTE<T, E = never> = TE.TaskEither<DatabaseError | E, T>;
