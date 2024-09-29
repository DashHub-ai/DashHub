import * as TE from 'fp-ts/lib/TaskEither';

import { timeout } from './timeout';

export function delayTaskEither<TE>(time: number) {
  return (task: TE): TE =>
    TE.chainFirst(() => async () => {
      await timeout(time);
      return TE.of(void 0) as any;
    })(task as any) as TE;
}
