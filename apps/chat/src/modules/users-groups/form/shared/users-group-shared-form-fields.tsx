import { controlled, useFormValidatorMessages, type ValidationErrorsListProps } from '@under-control/forms';

import type { SdkUsersGroupT } from '@llm/sdk';

import { FormField, Input } from '@llm/ui';
import { useI18n } from '~/i18n';

type Value = Pick<SdkUsersGroupT, 'name'>;

type Props = ValidationErrorsListProps<Value>;

export const UsersGroupSharedFormFields = controlled<Value, Props>(({ errors, control: { bind } }) => {
  const t = useI18n().pack.usersGroups.form;
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
