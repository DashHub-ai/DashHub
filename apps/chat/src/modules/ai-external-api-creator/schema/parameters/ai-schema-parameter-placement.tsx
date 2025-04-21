import { controlled, type OmitControlStateAttrs } from '@under-control/forms';

import { findItemById } from '@llm/commons';
import {
  type SdkAIExternalAPIParameterPlacementT,
  SdkAIExternalAPIParameterPlacementV,
} from '@llm/sdk';
import { Select, type SelectProps } from '~/ui';

type Props = Omit<OmitControlStateAttrs<SelectProps>, 'items'>;

export const AISchemaParameterPlacement = controlled<SdkAIExternalAPIParameterPlacementT, Props>((
  {
    control: { value, setValue },
    ...props
  },
) => {
  const placements = SdkAIExternalAPIParameterPlacementV.options.map(placement => ({
    id: placement,
    name: placement,
  }));

  return (
    <Select
      dropdownClassName="min-w-full"
      items={placements}
      value={
        findItemById(value)(placements)!
      }
      onChange={(placement) => {
        setValue({
          value: placement?.id as SdkAIExternalAPIParameterPlacementT,
        });
      }}
      {...props}
    />
  );
});
