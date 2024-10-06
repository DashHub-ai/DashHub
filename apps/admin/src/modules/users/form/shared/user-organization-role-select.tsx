import { controlled } from '@under-control/forms';

import type { SdkUserRoleT } from '@llm/sdk';

import { findItemById } from '@llm/commons';
import { Select } from '~/components';
import { useI18n } from '~/i18n';

export const UserOrganizationRoleSelect = controlled<SdkUserRoleT>(({ control: { value, setValue } }) => {
  const { userRoles } = useI18n().pack.modules.organizations;
  const items = Object.entries(userRoles).map(([role, name]) => ({
    id: role,
    name,
  }));

  return (
    <Select
      dropdownClassName="min-w-full"
      items={items}
      value={
        findItemById(value)(items)!
      }
      onChange={(role) => {
        setValue({
          value: role?.id as unknown as SdkUserRoleT,
        });
      }}
    />
  );
});
