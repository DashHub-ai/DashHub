import { useContextOrThrow } from '@dashhub/commons-front';
import { createAccessLevelGuard } from '~/modules/auth/firewall/create-access-level-guard';
import { createRecordAccessGuard } from '~/modules/dashboard/permissions/guards/create-record-access-guard';

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
    createRecordGuard: createRecordAccessGuard(session.token),
    get guard() {
      return createAccessLevelGuard(session.token);
    },
  };
}
