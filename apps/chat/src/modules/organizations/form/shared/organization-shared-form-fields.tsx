import { controlled, useFormValidatorMessages, type ValidationErrorsListProps } from '@under-control/forms';

import type { SdkOrganizationT } from '@llm/sdk';

import { FormField, Input, NumericInput } from '@llm/ui';
import { useI18n } from '~/i18n';

type Value = Pick<SdkOrganizationT, 'maxNumberOfUsers' | 'name'>;

type Props = ValidationErrorsListProps<Value>;

export const OrganizationSharedFormFields = controlled<Value, Props>(({ errors, control: { bind } }) => {
  const t = useI18n().pack.organizations.form;
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
        label={t.fields.maxNumberOfUsers.label}
        {...validation.extract('maxNumberOfUsers')}
      >
        <NumericInput
          name="maxNumberOfUsers"
          placeholder={t.fields.maxNumberOfUsers.placeholder}
          required
          min={1}
          {...bind.path('maxNumberOfUsers')}
        />
      </FormField>
    </>
  );
});
