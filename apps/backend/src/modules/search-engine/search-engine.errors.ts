import type { Task } from 'fp-ts/lib/Task';

import { taskEither as TE } from 'fp-ts';

import { TaggedError } from '@llm/commons';

export class SearchEngineError extends TaggedError.ofLiteral<any>()('SearchEngineError') {
  static tryCatch<R>(task: Task<R>) {
    return TE.tryCatch(
      task,
      (err: any) => new SearchEngineError(err),
    );
  }
}
