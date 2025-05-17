import { controlled, type OmitControlStateAttrs } from '@under-control/forms';

import { findItemById } from '@dashhub/commons';
import {
  type SdkAIExternalAPIParameterTypeT,
  SdkAIExternalAPIParameterTypeV,
} from '@dashhub/sdk';
import { Select, type SelectProps } from '~/ui';

type Props = Omit<OmitControlStateAttrs<SelectProps>, 'items'>;

export const AISchemaParameterType = controlled<SdkAIExternalAPIParameterTypeT, Props>((
  {
    control: { value, setValue },
    ...props
  },
) => {
  const types = SdkAIExternalAPIParameterTypeV.options.map(type => ({
    id: type,
    name: type,
  }));

  return (
    <Select
      dropdownClassName="min-w-full"
      items={types}
      value={
        findItemById(value)(types)!
      }
      onChange={(type) => {
        setValue({
          value: type?.id as SdkAIExternalAPIParameterTypeT,
        });
      }}
      {...props}
    />
  );
});
