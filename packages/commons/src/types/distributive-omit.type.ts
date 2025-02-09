/**
 * Omit key from all union types
 * https://stackoverflow.com/questions/57103834/
 *      typescript-omit-a-property-from-all-interfaces-in-a-union-but-keep-the-union-s
 *
 * @example
 *  type A = {
 *    type: "a",
 *    a: string,
 *    shared: string
 *  }
 *
 *  type B = {
 *    type: "b",
 *    b: string,
 *    shared: string
 *  }
 *
 *  type AB = A | B
 * { type: "a", a: string, shared: string } | { type: "b", b: string, shared: string }
 *
 *  type ABWithoutShared = DistributiveOmit<AB, 'shared'>
 *  { type: "a", a: string } | { type: "b", b: string }
 */
export type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;
