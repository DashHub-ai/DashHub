import type { Task } from 'fp-ts/lib/Task';

import { taskEither as TE } from 'fp-ts';

import { TaggedError } from '@llm/commons';

export class SearchEngineProxyError extends TaggedError.ofLiteral<any>()('SearchEngineProxyError') {
  static tryCatch<R>(task: Task<R>) {
    return TE.tryCatch(
      task,
      (err: any) => new SearchEngineProxyError(err),
    );
  }
}
