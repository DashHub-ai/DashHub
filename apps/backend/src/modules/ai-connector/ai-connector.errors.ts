import type { Task } from 'fp-ts/lib/Task';

import { taskEither as TE } from 'fp-ts';

import { TaggedError } from '@llm/commons';

export class AIConnectionCreatorError extends TaggedError.ofLiteral<any>()('AIConnectionCreatorError') {
  static tryCatch<R>(task: Task<R>) {
    return TE.tryCatch(
      task,
      (err: any) => {
        console.error(err);
        return new AIConnectionCreatorError(err);
      },
    );
  }
}
