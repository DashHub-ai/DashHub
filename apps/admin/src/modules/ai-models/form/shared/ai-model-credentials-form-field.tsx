import { controlled, useFormValidatorMessages, type ValidationErrorsListProps } from '@under-control/forms';

import type { SdkAICredentialsT, SdkAIProviderT } from '@llm/sdk';

import { FormField, Input } from '@llm/ui';
import { useI18n } from '~/i18n';

type Props =
  & ValidationErrorsListProps<SdkAICredentialsT>
  & {
    provider: SdkAIProviderT;
  };

export const AIModelCredentialsFormFields = controlled<SdkAICredentialsT, Props>(({ errors, provider, control: { bind } }) => {
  const t = useI18n().pack.modules.aiModels.form.fields.credentials;
  const validation = useFormValidatorMessages({ errors });

  switch (provider) {
    case 'openai':
      return (
        <>
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

    default:
      return null;
  }
});
