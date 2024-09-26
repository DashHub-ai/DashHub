export type ReplaceFnReturnType<T extends (...args: any) => any, R> = (
  ...args: Parameters<T>
) => R;
