import type { KeyOfType } from './key-of-type.type';

export type RecordOfType<T, U> = {
  [K in KeyOfType<T, U>]: T[K];
};
