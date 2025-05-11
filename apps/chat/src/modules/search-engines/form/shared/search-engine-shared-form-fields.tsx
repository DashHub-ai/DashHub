import { controlled, useFormValidatorMessages, type ValidationErrorsListProps } from '@under-control/forms';

import type { SdkSearchEngineT } from '@dashhub/sdk';

import { useI18n } from '~/i18n';
import { Checkbox, FormField, Input, TextArea } from '~/ui';

import { SearchEngineCredentialsFormFields } from './search-engine-credentials-form-field';
import { SearchEngineProviderSelect } from './search-engine-provider-select';

type Value = Pick<
  SdkSearchEngineT,
  'name' | 'provider' | 'description' | 'credentials' | 'default'
>;

type Props = ValidationErrorsListProps<Value>;

export const SearchEngineSharedFormFields = controlled<Value, Props>(({ errors, control: { bind } }) => {
  const t = useI18n().pack.searchEngines.form;
  const validation = useFormValidatorMessages({ errors });

  return (
    <>
      <FormField
        className="uk-margin"
        label={t.fields.name.label}
        {...validation.extract('name')}
      >
        <Input
          name="name"
          placeholder={t.fields.name.placeholder}
          required
          {...bind.path('name')}
        />
      </FormField>

      <FormField
        className="uk-margin"
        label={t.fields.description.label}
        {...validation.extract('description')}
      >
        <TextArea
          name="description"
          placeholder={t.fields.description.placeholder}
          {...bind.path('description', { input: val => val ?? '' })}
        />
      </FormField>

      <hr />

      <FormField
        className="uk-margin"
        label={t.fields.provider.label}
        {...validation.extract('provider')}
      >
        <SearchEngineProviderSelect
          {...bind.path('provider', {
            relatedInputs: ({ newGlobalValue }) => ({
              ...newGlobalValue,
              credentials: {
                apiKey: '',
                apiModel: '',
              },
            }),
          })}
        />
      </FormField>

      <SearchEngineCredentialsFormFields
        {...bind.path('credentials')}
        {...validation.extract('credentials', { nested: true })}
      />

      <hr />

      <FormField
        className="uk-margin"
        label={t.fields.settings.label}
      >
        <Checkbox
          {...bind.path('default')}
          className="block uk-text-small"
        >
          {t.fields.defaultForOrganization.label}
        </Checkbox>
      </FormField>
    </>
  );
});
