export function once<T>(fn: () => T): (() => T) {
  let result: T | undefined;
  let called = false;

  return () => {
    if (!called) {
      result = fn();
      called = true;
    }

    return result as T;
  };
}
