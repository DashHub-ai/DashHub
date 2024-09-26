import type { taskEither as TE } from 'fp-ts';
import type { Context } from 'hono';

import { either as E } from 'fp-ts';

import type { TaggedError } from '@llm/commons';

import { SdkServerError } from '@llm/sdk';
import { LoggerService } from '~/modules/logger';

export function serializeSdkResponseTE<T extends TE.TaskEither<TaggedError<`Sdk${string}`, any>, any>>(context: Context) {
  const logger = LoggerService.of('serializeSdkResponseTE');

  return async (task: T) => {
    try {
      const result = await task();

      if (E.isLeft(result)) {
        return context.json(
          {
            error: result.left.serialize(),
          },
          result.left.httpCode as any,
        );
      }

      return context.json({
        data: result.right,
      });
    }
    catch (error) {
      logger.error('Unexpected while serializing SDK response!', error);

      return context.json(
        {
          error: new SdkServerError({ message: 'Internal server error!' }).serialize(),
        },
        500,
      );
    }
  };
}
