import { controlled, useFormValidatorMessages, type ValidationErrorsListProps } from '@under-control/forms';

import type { SdkUserT } from '@llm/sdk';

import { FormField, Input } from '~/components';
import { useI18n } from '~/i18n';

type Value = Pick<SdkUserT, 'email' | 'active' | 'archiveProtection'>;

type Props = ValidationErrorsListProps<Value>;

export const UserSharedFormFields = controlled<Value, Props>(({ errors, control: { bind } }) => {
  const t = useI18n().pack.modules.users.form;
  const validation = useFormValidatorMessages({ errors });

  return (
    <FormField
      className="uk-margin"
      label={t.fields.email.label}
      {...validation.extract('email')}
    >
      <Input
        name="email"
        placeholder={t.fields.email.placeholder}
        required
        {...bind.path('email')}
      />
    </FormField>
  );
});
