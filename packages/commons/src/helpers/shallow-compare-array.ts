/**
 * Shallow comparison of two arrays.
 */
export function shallowCompareArrays<T>(
  a: Readonly<Array<T> | null>,
  b: Readonly<Array<T> | null>,
): boolean {
  if (a === b) {
    return true;
  }

  if (!a || !b) {
    return false;
  }

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}
