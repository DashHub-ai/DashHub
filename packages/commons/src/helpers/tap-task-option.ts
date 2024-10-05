import { pipe } from 'fp-ts/function';
import * as TO from 'fp-ts/TaskOption';

export function tapTaskOption<A>(fn: (data: A) => void) {
  return (task: TO.TaskOption<A>): TO.TaskOption<A> =>
    pipe(
      task,
      TO.map((data) => {
        fn(data);
        return data;
      }),
    );
}
