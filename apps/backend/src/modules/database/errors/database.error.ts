import type { Task } from 'fp-ts/lib/Task';

import { taskEither as TE } from 'fp-ts';

import { TaggedError } from '@llm/commons';

import { DatabaseRecordAlreadyExists } from './database-record-already-exists.error';

export class DatabaseError extends TaggedError.ofLiteral()('DatabaseError') {
  static readonly PG_ERROR_CODES = {
    RECORD_ALREADY_EXISTS: '23505',
  };

  static tryTask<T>(task: Task<T>) {
    return TE.tryCatch(task, (err: any) => {
      switch (err.code) {
        case DatabaseError.PG_ERROR_CODES.RECORD_ALREADY_EXISTS:
          return new DatabaseRecordAlreadyExists(err);

        default:
          return new DatabaseError(err);
      }
    });
  }
}

export type DatabaseTE<T, E = never> = TE.TaskEither<
  DatabaseError | DatabaseRecordAlreadyExists | E,
  T
>;
