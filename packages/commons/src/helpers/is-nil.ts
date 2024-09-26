export function isNil(val: unknown): val is undefined | null {
  return val === null || typeof val === 'undefined';
}
