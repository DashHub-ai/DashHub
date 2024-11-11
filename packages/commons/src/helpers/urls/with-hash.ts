import { pipe } from 'fp-ts/lib/function';

import type { Nullable } from '../../types';

import { dropHash } from './drop-hash';

export function withHash(hash: Nullable<string>) {
  return (url: string) =>
    pipe(url, dropHash, str => (hash ? `${str}#${hash}` : str));
}
