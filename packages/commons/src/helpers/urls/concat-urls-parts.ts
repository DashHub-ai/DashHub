import { concatUrls } from './concat-urls';

export function concatUrlPartsA(parts: string[]): string {
  return parts.reduce((acc, part) => concatUrls(acc, part), '');
}

export function concatUrlParts(...parts: string[]): string {
  return concatUrlPartsA(parts);
}

export function concatUrlParts2C(...prefix: string[]) {
  return (b: string) =>
    concatUrlParts(...prefix, b);
}
