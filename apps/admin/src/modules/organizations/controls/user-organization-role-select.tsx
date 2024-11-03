import { controlled, type OmitControlStateAttrs } from '@under-control/forms';

import type { SdkOrganizationUserRoleT } from '@llm/sdk';

import { findItemById } from '@llm/commons';
import { Select, type SelectProps } from '@llm/ui';
import { useI18n } from '~/i18n';

type Props = Omit<OmitControlStateAttrs<SelectProps>, 'items'>;

export const UserOrganizationRoleSelect = controlled<SdkOrganizationUserRoleT, Props>((
  {
    control: { value, setValue },
    ...props
  },
) => {
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
          value: role?.id as unknown as SdkOrganizationUserRoleT,
        });
      }}
      {...props}
    />
  );
});
