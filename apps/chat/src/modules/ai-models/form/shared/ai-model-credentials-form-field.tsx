import { controlled, useFormValidatorMessages, type ValidationErrorsListProps } from '@under-control/forms';

import type { SdkAICredentialsT, SdkAIProviderT } from '@dashhub/sdk';

import { useI18n } from '~/i18n';
import { FormField, Input } from '~/ui';

type Props = ValidationErrorsListProps<SdkAICredentialsT> & {
  provider: SdkAIProviderT;
};

export const AIModelCredentialsFormFields = controlled<SdkAICredentialsT, Props>(({ errors, provider, control: { bind } }) => {
  const t = useI18n().pack.aiModels.form.fields.credentials;
  const validation = useFormValidatorMessages({ errors });

  return (
    <>
      {provider === 'other' && (
        <FormField
          className="uk-margin"
          label={t.apiUrl.label}
          {...validation.extract('apiUrl')}
        >
          <Input
            name="name"
            placeholder={t.apiUrl.placeholder}
            {...bind.path('apiUrl')}
          />
        </FormField>
      )}

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

      <FormField
        className="uk-margin"
        label={t.apiModel.label}
        {...validation.extract('apiModel')}
      >
        <Input
          name="name"
          placeholder={t.apiModel.placeholder}
          required
          {...bind.path('apiModel')}
        />
      </FormField>
    </>
  );
});
