import { clsx } from 'clsx';

import type { SdkOrganizationUserRoleT } from '@dashhub/sdk';

import { useI18n } from '~/i18n';

type Props = {
  value: SdkOrganizationUserRoleT;
};

export function OrganizationUserRoleBadge({ value }: Props) {
  const { userRoles } = useI18n().pack.organizations;

  const roleClassName: string = (() => {
    switch (value) {
      case 'member':
        return 'uk-badge-secondary';

      case 'owner':
        return 'uk-badge-danger';

      case 'tech':
        return 'uk-badge-success';

      default: {
        const _: never = value;

        return '';
      }
    }
  })();

  return (
    <span className={clsx('uk-badge', roleClassName)}>
      {userRoles[value]}
    </span>
  );
}
