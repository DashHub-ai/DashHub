import { controlled, useFormValidatorMessages, type ValidationErrorsListProps } from '@under-control/forms';

import type { SdkAIModelT } from '@llm/sdk';

import { FormField, Input, TextArea } from '@llm/ui';
import { useI18n } from '~/i18n';

type Value = Pick<SdkAIModelT, 'name' | 'description'>;

type Props = ValidationErrorsListProps<Value>;

export const AIModelSharedFormFields = controlled<Value, Props>(({ errors, control: { bind } }) => {
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
    </>
  );
});
