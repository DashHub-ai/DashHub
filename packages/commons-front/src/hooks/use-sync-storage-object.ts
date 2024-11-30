import type { z } from 'zod';

import { flow, identity, pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import { useRef } from 'react';

import { tryParseJSON, tryParseUsingZodSchema } from '@llm/commons';

import { useForceRerender } from './use-force-rerender';

type AbstractSyncStorage = {
  removeItem: (key: string) => void;
  getItem: (key: string) => any;
  setItem: (key: string, value: string) => void;
};

export type SyncStorageConfig<S extends z.ZodType<unknown>> = {
  schema: S;
  storage: AbstractSyncStorage;
  forceParseIfNotSet?: boolean;
  rerenderOnSet?: boolean;
  readBeforeMount?: boolean;
};

export function useSyncStorageObject<S extends z.ZodType<unknown>>(
  name: string,
  {
    schema,
    storage,
    forceParseIfNotSet,
    rerenderOnSet = true,
    readBeforeMount = true,
  }: SyncStorageConfig<S>,
) {
  const cache = useRef<O.Option<z.infer<S>>>(O.none);
  const { revision, forceRerender } = useForceRerender();

  const clear = () => {
    cache.current = O.none;
    localStorage.removeItem(name);

    if (rerenderOnSet) {
      forceRerender();
    }
  };

  const get = () => {
    if (O.isSome(cache.current)) {
      return cache.current;
    }

    return pipe(
      storage.getItem(name),
      data => tryParseJSON<z.infer<S>>(data),
      forceParseIfNotSet
        ? O.orElse(() => O.some(null))
        : identity,
      O.chainEitherK(tryParseUsingZodSchema(schema)),
    );
  };

  const getOrNull = flow(get, O.toNullable);

  const set = (value: z.infer<S>) => {
    storage.setItem(name, JSON.stringify(value));
    cache.current = O.some(value);

    if (rerenderOnSet) {
      forceRerender();
    }
  };

  if (readBeforeMount) {
    cache.current = get();
  }

  return {
    revision,
    clear,
    getOrNull,
    get,
    set,
  };
}
