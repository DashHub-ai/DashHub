import type { TaggedError } from '@llm/commons';

export function isSdkTaggedError<T extends object>(
  error: TaggedError<string, T>,
): error is TaggedError<`Sdk${string}`, T> {
  return error.tag.startsWith('Sdk');
}
