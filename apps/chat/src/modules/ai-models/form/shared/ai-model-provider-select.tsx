import { controlled } from '@under-control/forms';

import type { SdkUserRoleT } from '@dashhub/sdk';

import { findItemById } from '@dashhub/commons';
import { useI18n } from '~/i18n';
import { Select } from '~/ui';

export const AIModelProviderSelect = controlled<SdkUserRoleT>(({ control: { value, setValue } }) => {
  const { providers } = useI18n().pack.aiModels;
  const items = Object.entries(providers).map(([role, name]) => ({
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
