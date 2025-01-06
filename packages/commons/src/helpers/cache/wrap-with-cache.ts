import { Time } from '../time';

type AnyFunction = (...args: any[]) => any;

type CacheOptions<Args extends unknown[]> = {
  ttlMs?: number;
  getKey?: (...args: Args) => string | number;
  autoPrune?: boolean;
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
  } = options;

  const cache = new Map<string | number, CacheEntry<ReturnType<Func>>>();
  const pruneExpired = () => {
    const now = Date.now();

    for (const [key, entry] of cache.entries()) {
      if (now - entry.timestamp >= ttlMs) {
        cache.delete(key);
      }
    }
  };

  const wrapped = (...args: any[]) => async () => {
    const key = getKey(...args as Parameters<Func>);
    const now = Date.now();
    const cached = cache.get(key);

    if (cached && now - cached.timestamp < ttlMs) {
      return cached.value;
    }

    return fn(...args)().then((value: any) => {
      cache.set(key, { value, timestamp: now });

      if (autoPrune) {
        pruneExpired();
      }

      return value;
    });
  };

  wrapped.clear = () => {
    cache.clear();
  };

  return wrapped as CachedFunction<Func>;
}
