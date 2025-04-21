import { Time } from '../time';

export type CacheWrapperStorageMap = Map<string | number, CacheEntry<ReturnType<any>>>;

type AnyFunction = (...args: any[]) => any;

type CacheOptions<Args extends unknown[]> = {
  ttlMs?: number;
  getKey?: (...args: Args) => string | number;
  autoPrune?: boolean;
  storage?: CacheWrapperStorageMap;
};

type CacheEntry<T> = {
  value: T;
  timestamp: number;
};

type CachedFunction<Func extends AnyFunction> = Func & {
  clear: () => void;
};

export function wrapWithCache<Func extends AnyFunction>(
  fn: Func,
  options: CacheOptions<Parameters<Func>> = {},
): CachedFunction<Func> {
  const {
    ttlMs = Time.toMilliseconds.minutes(15),
    getKey = (...args) => JSON.stringify(args),
    autoPrune = true,
    storage = new Map(),
  } = options;

  const pruneExpired = () => {
    const now = Date.now();

    for (const [key, entry] of storage.entries()) {
      if (now - entry.timestamp >= ttlMs) {
        storage.delete(key);
      }
    }
  };

  const wrapped = (...args: any[]) => async () => {
    const key = getKey(...args as Parameters<Func>);

    const now = Date.now();
    const cached = storage.get(key);

    if (cached && now - cached.timestamp < ttlMs) {
      return cached.value;
    }

    return fn(...args)().then((value: any) => {
      storage.set(key, { value, timestamp: now });

      if (autoPrune) {
        pruneExpired();
      }

      return value;
    });
  };

  wrapped.clear = () => {
    storage.clear();
  };

  return wrapped as CachedFunction<Func>;
}
