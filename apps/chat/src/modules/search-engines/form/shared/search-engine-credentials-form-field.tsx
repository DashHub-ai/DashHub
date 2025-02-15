import { controlled, useFormValidatorMessages, type ValidationErrorsListProps } from '@under-control/forms';

import type { SdkAICredentialsT, SdkSearchEngineCredentialsT } from '@llm/sdk';

import { useI18n } from '~/i18n';
import { FormField, Input } from '~/ui';

type Props = ValidationErrorsListProps<SdkSearchEngineCredentialsT>;

export const SearchEngineCredentialsFormFields = controlled<SdkAICredentialsT, Props>(({ errors, control: { bind } }) => {
  const t = useI18n().pack.searchEngines.form.fields.credentials;
  const validation = useFormValidatorMessages({ errors });

  return (
    <FormField
      className="uk-margin"
      label={t.apiKey.label}
      {...validation.extract('apiKey')}
    >
      <Input
        name="name"
        placeholder={t.apiKey.placeholder}
        required
        {...bind.path('apiKey')}
      />
    </FormField>
  );
});
