import type { Task } from 'fp-ts/lib/Task';

import { taskEither as TE } from 'fp-ts';

import { TaggedError } from '@llm/commons';

export class OpenAIConnectionCreatorError extends TaggedError.ofLiteral<any>()('OpenAIConnectionCreatorError') {
  static tryCatch<R>(task: Task<R>) {
    return TE.tryCatch(
      task,
      (err: any) => new OpenAIConnectionCreatorError(err),
    );
  }
}
