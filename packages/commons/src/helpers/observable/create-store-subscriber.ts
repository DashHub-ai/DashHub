import type { IO } from 'fp-ts/IO';
import type { Reader } from 'fp-ts/Reader';

import fastDeepEq from 'fast-deep-equal';

import { without } from '../without';

export type StoreSubscriber<V> = {
  subscribers: Array<Reader<V, void>>;
  subscribe: (subscriber: Reader<V, void>) => VoidFunction;
  notify: (value: V) => void;
  getSnapshot: IO<V>;
};

export function createStoreSubscriber<V>(initialValue: V): StoreSubscriber<V> {
  const snapshot: { current: V; } = {
    current: initialValue,
  };

  const ctx: StoreSubscriber<V> = {
    subscribers: [],
    getSnapshot: () => snapshot.current,
    notify: (value) => {
      if (fastDeepEq(value, snapshot.current)) {
        return;
      }

      snapshot.current = value;

      for (const subscriber of ctx.subscribers) {
        subscriber(snapshot.current);
      }
    },
    subscribe: (subscriber) => {
      ctx.subscribers.push(subscriber);

      return () => {
        ctx.subscribers = without([subscriber])(ctx.subscribers);
      };
    },
  };

  return ctx;
}
