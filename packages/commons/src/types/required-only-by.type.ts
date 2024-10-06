export type RequiredOnlyBy<T, K extends keyof T> =
  & Partial<T>
  & Required<Pick<T, K>>;
