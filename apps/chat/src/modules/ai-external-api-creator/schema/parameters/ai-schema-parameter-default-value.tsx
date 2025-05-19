import { controlled } from '@under-control/forms';

import type { SdkAIExternalAPIParameterTypeT } from '@dashhub/sdk';

import { useI18n } from '~/i18n';
import { Checkbox, Input, NumericInput } from '~/ui';

type Props = {
  type: SdkAIExternalAPIParameterTypeT;
};

export const AISchemaParameterDefaultValue = controlled<any, Props>(({
  control: { bind, value },
  type,
  ...props
}) => {
  const t = useI18n().pack.aiExternalAPIs.fields.schema.parameter;

  if (type === 'boolean') {
    return (
      <Checkbox
        {...bind.entire()}
        {...props}
      />
    );
  }

  if (type === 'number') {
    return (
      <NumericInput
        {...bind.entire()}
        {...props}
        placeholder={t.placeholders.numberValue}
      />
    );
  }

  return (
    <Input
      type="text"
      {...bind.entire()}
      value={value ?? ''}
      {...props}
      placeholder={t.placeholders.textValue}
    />
  );
});
