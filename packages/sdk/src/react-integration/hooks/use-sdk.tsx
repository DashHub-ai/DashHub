import { useContextOrThrow } from '@llm/commons-front';

import { SdkContext } from '../sdk-context';

export function useSdk() {
  return useContextOrThrow(SdkContext, 'Missing SDK context in tree!');
}

export function useSdkIsLoggedIn() {
  return useSdk().session.isLoggedIn;
}

export function useSdkForLoggedIn() {
  const { session, ...sdk } = useSdk();

  if (!session.isLoggedIn) {
    throw new Error('User is not logged in!');
  }

  return {
    ...sdk,
    session,
  };
}
