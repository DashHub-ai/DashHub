import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';

export function tapOption<A>(fn: (data: A) => void) {
  return (task: O.Option<A>): O.Option<A> =>
    pipe(
      task,
      O.map((data) => {
        fn(data);
        return data;
      }),
    );
}
