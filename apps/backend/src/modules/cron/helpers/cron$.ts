import { Cron } from 'croner';
import { Observable } from 'rxjs';

/**
 * Creates an observable that emits a value at a specified interval.
 *
 * @param expression - A cron expression.
 * @returns An observable that emits a value at a specified interval.
 */
export function cron$(expression: string) {
  return new Observable<Date>((subscriber) => {
    const task = new Cron(expression, () => {
      subscriber.next();
    });

    return () => {
      task.stop();
    };
  });
}
