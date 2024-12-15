import type { Task } from 'fp-ts/lib/Task';

import { taskEither as TE } from 'fp-ts';

import { TaggedError } from '@llm/commons';

export class S3UploadError extends TaggedError.ofLiteral<any>()('S3UploadError') {
  static tryCatch<R>(task: Task<R>) {
    return TE.tryCatch(
      task,
      (err: any) => new S3UploadError(err),
    );
  }
}
