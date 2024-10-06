import { controlled } from '@under-control/forms';

import type { SdkUserRoleT } from '@llm/sdk';

import { findItemById } from '@llm/commons';
import { Select } from '~/components';
import { useI18n } from '~/i18n';

export const UserRoleSelect = controlled<SdkUserRoleT>(({ control: { value, setValue } }) => {
  const { roles } = useI18n().pack.modules.users;
  const items = Object.entries(roles).map(([role, name]) => ({
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
