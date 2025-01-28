export const SDK_CREDENTIALS_MASK = '********';

export function isSDKCredentialsMasked(value: string): boolean {
  return value === SDK_CREDENTIALS_MASK;
}
