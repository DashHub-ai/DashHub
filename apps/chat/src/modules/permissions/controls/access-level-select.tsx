import { controlled, type OmitControlStateAttrs } from '@under-control/forms';

import type { SdkPermissionAccessLevelT } from '@llm/sdk';

import { findItemById } from '@llm/commons';
import { useI18n } from '~/i18n';
import { Select, type SelectProps } from '~/ui';

type Props = Omit<OmitControlStateAttrs<SelectProps>, 'items'>;

export const AccessLevelSelect = controlled<SdkPermissionAccessLevelT, Props>((
  {
    control: { value, setValue },
    ...props
  },
) => {
  const { accessLevels } = useI18n().pack.permissions;
  const items = Object.entries(accessLevels).map(([role, name]) => ({
    id: role,
    name,
  }));

  return (
    <Select
      items={items}
      value={
        findItemById(value)(items)!
      }
      onChange={(role) => {
        setValue({
          value: role?.id as unknown as SdkPermissionAccessLevelT,
        });
      }}
      {...props}
    />
  );
});
