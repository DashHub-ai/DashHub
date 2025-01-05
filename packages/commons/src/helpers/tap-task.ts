import { pipe } from 'fp-ts/function';
import * as T from 'fp-ts/Task';

export function tapTask<A>(fn: (data: A) => void) {
  return (task: T.Task<A>): T.Task<A> =>
    pipe(
      task,
      T.map((data) => {
        fn(data);
        return data;
      }),
    );
}

export function tapTaskT<A, R>(fn: (data: A) => T.Task<R>) {
  return (task: T.Task<A>): T.Task<A> =>
    pipe(task, T.chainFirst(fn));
}
