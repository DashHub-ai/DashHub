import type { Overwrite } from './overwrite.type';

export type DistributiveOverwrite<T, U> = T extends any
  ? Overwrite<T, U>
  : never;
