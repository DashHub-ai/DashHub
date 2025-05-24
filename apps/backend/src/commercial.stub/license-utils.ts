import type { SdkJwtLicenseTokenT } from '@dashhub/agents-library-sdk';

export function isPremiumEnabled() {
  return false;
}

export function setLicenseKey(_: string) {
  // No-op in stub
}

export function getLicenseKeyOrPanic(): SdkJwtLicenseTokenT {
  throw new Error('License key is not set in stub environment');
}
