import type { SerializedTaggedError } from '@llm/commons';

export type SdkErrorResponseT = {
  error: SerializedTaggedError;
};

export function isSdkErrorResponseDto(data: any): data is SdkErrorResponseT {
  return !!data && typeof data === 'object' && 'error' in data;
}
