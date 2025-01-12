import { clsx } from 'clsx';
import { Crown, Wrench } from 'lucide-react';

import { isTechOrOwnerUserSdkOrganizationRole, useSdkForLoggedIn } from '@llm/sdk';
import { useI18n } from '~/i18n';

export function NavigationLoggedAsBar() {
  const t = useI18n().pack.navigation.loggedAsRow;
  const { session: { token } } = useSdkForLoggedIn();

  const isRoot = token.role === 'root';
  const isTechUser = !isRoot && token.organization && isTechOrOwnerUserSdkOrganizationRole(token.organization.role);

  if (!isRoot && !isTechUser) {
    return null;
  }

  return (
    <div
      className={clsx(
        'flex justify-center items-center gap-2 px-4 py-1 w-full text-center text-sm text-white',
        isRoot ? 'bg-red-500' : 'bg-orange-500',
      )}
    >
      {isRoot
        ? (
            <>
              <Crown size={16} />
              {' '}
              {t.rootUser}
            </>
          )
        : (
            <>
              <Wrench size={16} />
              {' '}
              {t.techUser}
            </>
          )}
    </div>
  );
}
