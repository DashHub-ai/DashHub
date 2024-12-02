import type { TaskEither } from 'fp-ts/TaskEither';

import { pipe } from 'fp-ts/function';

import { tapTaskEither } from './tap-task-either';
import { tryOrThrowTE } from './try-or-throw-task-either';

export class AsyncTaskCache<K, C, T> {
  private readonly syncCache = new Map<K, T>();
  private readonly asyncCache = new Map<K, Promise<T>>();

  constructor(private readonly getTask: (key: K, context: C) => TaskEither<Error, T>) {}

  async get(key: K, context: C): Promise<T> {
    const syncValue = this.syncCache.get(key);
    if (syncValue) {
      return syncValue;
    }

    if (this.asyncCache.has(key)) {
      return this.asyncCache.get(key)!;
    }

    const promise = pipe(
      this.getTask(key, context),
      tapTaskEither((value) => {
        this.syncCache.set(key, value);
      }),
      tryOrThrowTE,
    )();

    this.asyncCache.set(key, promise);
    return promise;
  }

  getSyncValue(key: K): T | undefined {
    return this.syncCache.get(key);
  }

  clear(): void {
    this.syncCache.clear();
    this.asyncCache.clear();
  }
}
