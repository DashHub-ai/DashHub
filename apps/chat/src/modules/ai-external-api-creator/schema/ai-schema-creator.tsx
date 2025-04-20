import type { ValidationErrorsListProps } from '@under-control/forms';

import { controlled, useFormValidatorMessages } from '@under-control/forms';

import type { SdkAIExternalAPISchemaT } from '@llm/sdk';

import { useI18n } from '~/i18n';
import { FormField } from '~/ui';

import { AISchemaEndpoints } from './endpoints';

type Props = ValidationErrorsListProps<SdkAIExternalAPISchemaT>;

export const AISchemaCreator = controlled<SdkAIExternalAPISchemaT, Props>(({ control: { bind }, errors }) => {
  const t = useI18n().pack.aiExternalAPIs;
  const validation = useFormValidatorMessages({ errors });

  return (
    <FormField
      className="uk-margin"
      label={t.fields.schema.endpoints.label}
      {...validation.extract('schema')}
    >
      <AISchemaEndpoints {...bind.path('endpoints', { input: val => val ?? [] })} />
    </FormField>
  );
});
