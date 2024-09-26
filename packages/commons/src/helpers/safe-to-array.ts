import type { CanBeArray } from '../types';

export function safeToArray<T>(items: CanBeArray<T>): T[] {
  return Array.isArray(items) ? items : [items];
}
