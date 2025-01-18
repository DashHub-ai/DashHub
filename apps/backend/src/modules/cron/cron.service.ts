import type { Promisable } from 'type-fest';

import { inspect } from 'node:util';

import * as TE from 'fp-ts/lib/TaskEither';
import { defer, exhaustMap, type Subscription, tap } from 'rxjs';
import { injectable } from 'tsyringe';

import type { CronError } from './cron.error';

import { cron$ } from './helpers';

/**
 * Attributes to register a cron job.
 */
type CronRegisterAttributes = {
  expression: string;
  skipIfPreviousJobNotDone?: boolean;
};

@injectable()
export class CronService {
  /**
   * Registers a cron job.
   */
  tryRegister(
    attrs: CronRegisterAttributes,
    fn: () => Promisable<void>,
  ): TE.TaskEither<CronError, Subscription> {
    const execJob = async () => {
      try {
        await fn();
      }
      catch (e) {
        console.error('Failed to exec cron job!', inspect(e, false, 4));
      }
    };

    const middleware = attrs.skipIfPreviousJobNotDone
      ? exhaustMap(() => defer(execJob))
      : tap(() => {
          void execJob();
        });

    return TE.of(cron$(attrs.expression).pipe(middleware).subscribe());
  }
}
