import type { ValidationErrorsListProps } from '@under-control/forms';

import { controlled, useFormValidatorMessages } from '@under-control/forms';

import type { SdkAIExternalAPISchemaT } from '@llm/sdk';

import { useI18n } from '~/i18n';
import { FormField, Input } from '~/ui';

import { AISchemaEndpoints } from './endpoints';
import { AISchemaParameters } from './parameters';

type Props = ValidationErrorsListProps<SdkAIExternalAPISchemaT> & {
  className?: string;
};

export const AISchemaCreator = controlled<SdkAIExternalAPISchemaT, Props>(({ control: { bind }, className, errors }) => {
  const t = useI18n().pack.aiExternalAPIs;
  const validation = useFormValidatorMessages({ errors });

  return (
    <div className={className}>
      <div className="bg-gray-50 mb-8 p-4 rounded-md">
        <h3 className="mb-4 font-medium text-lg">
          {t.fields.schema.globalApiSettings}
        </h3>

        <FormField
          className="uk-margin"
          label={t.fields.schema.apiUrl.label}
          {...validation.extract('apiUrl')}
        >
          <Input
            {...bind.path('apiUrl')}
            placeholder="https://api.example.com"
            required
          />
        </FormField>

        <FormField
          className="uk-margin"
          label={t.fields.schema.parameters.label}
          {...validation.extract('parameters')}
        >
          <AISchemaParameters
            {...bind.path('parameters', { input: val => val ?? [] })}
            enforcedConstantValues
          />
        </FormField>
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="mb-4 font-medium text-lg">
          {t.fields.schema.endpoints.label}
        </h3>

        <AISchemaEndpoints {...bind.path('endpoints', { input: val => val ?? [] })} />
      </div>
    </div>
  );
});
