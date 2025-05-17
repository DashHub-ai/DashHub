import { controlled, type OmitControlStateAttrs } from '@under-control/forms';

import { findItemById } from '@dashhub/commons';
import {
  SDK_AI_EXTERNAL_API_ENDPOINT_METHODS,
  type SdkOrganizationUserRoleT,
} from '@dashhub/sdk';
import { Select, type SelectProps } from '~/ui';

type Props = Omit<OmitControlStateAttrs<SelectProps>, 'items'>;

export const AISchemaEndpointMethod = controlled<SdkOrganizationUserRoleT, Props>((
  {
    control: { value, setValue },
    ...props
  },
) => {
  const items = SDK_AI_EXTERNAL_API_ENDPOINT_METHODS.map(method => ({
    id: method,
    name: method,
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
