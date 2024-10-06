import type { RequiredBy } from './required-by.type';

export type RequiredOnlyBy<T, K extends keyof T> =
  & RequiredBy<T, K>
  & Partial<T>;
