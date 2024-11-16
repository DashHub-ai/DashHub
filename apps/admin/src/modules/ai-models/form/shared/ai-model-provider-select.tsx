import { controlled } from '@under-control/forms';

import type { SdkUserRoleT } from '@llm/sdk';

import { findItemById } from '@llm/commons';
import { Select } from '@llm/ui';
import { useI18n } from '~/i18n';

export const AIModelProviderSelect = controlled<SdkUserRoleT>(({ control: { value, setValue } }) => {
  const { providers } = useI18n().pack.modules.aiModels;
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
