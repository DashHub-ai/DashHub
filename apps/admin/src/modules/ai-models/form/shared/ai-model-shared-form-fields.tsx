import { controlled, useFormValidatorMessages, type ValidationErrorsListProps } from '@under-control/forms';

import type { SdkAIModelT } from '@llm/sdk';

import { Checkbox, FormField, Input, TextArea } from '@llm/ui';
import { useI18n } from '~/i18n';

import { AIModelCredentialsFormFields } from './ai-model-credentials-form-field';
import { AIModelProviderSelect } from './ai-model-provider-select';

type Value = Pick<
  SdkAIModelT,
  'name' | 'provider' | 'description' | 'credentials' | 'default' | 'embedding'
>;

type Props = ValidationErrorsListProps<Value>;

export const AIModelSharedFormFields = controlled<Value, Props>(({ errors, control: { value, bind } }) => {
  const t = useI18n().pack.modules.aiModels.form;
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
          {...bind.path('description')}
        />
      </FormField>

      <hr />

      <FormField
        className="uk-margin"
        label={t.fields.provider.label}
        {...validation.extract('provider')}
      >
        <AIModelProviderSelect
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

      <AIModelCredentialsFormFields
        provider={value.provider}
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

        <Checkbox
          {...bind.path('embedding')}
          className="block uk-text-small"
        >
          {t.fields.embedding.label}
        </Checkbox>
      </FormField>
    </>
  );
});
