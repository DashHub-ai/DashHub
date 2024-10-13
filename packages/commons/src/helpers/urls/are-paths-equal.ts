import { dropSearchParams } from './drop-search-params';

export function arePathsEqual(path1: string, path2: string) {
  return dropSearchParams(path1) === dropSearchParams(path2);
}
