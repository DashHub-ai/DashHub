import { controlled, useFormValidatorMessages, type ValidationErrorsListProps } from '@under-control/forms';

import type { SdkProjectT } from '@llm/sdk';

import { FormField, Input } from '~/components';
import { useI18n } from '~/i18n';

type Value = Pick<SdkProjectT, 'name'>;

type Props = ValidationErrorsListProps<Value>;

export const ProjectSharedFormFields = controlled<Value, Props>(({ errors, control: { bind } }) => {
  const t = useI18n().pack.modules.projects.form;
  const validation = useFormValidatorMessages({ errors });

  return (
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
  );
});
