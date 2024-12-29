import {
  controlled,
  useFormValidatorMessages,
  type ValidationErrorsListProps,
} from '@under-control/forms';

import { FormField } from '@llm/ui';
import { useI18n } from '~/i18n';
import { UserOrganizationRoleSelect } from '~/modules/organizations';

import type { CreateUserOrganizationValue } from '../types';

type Props = ValidationErrorsListProps<CreateUserOrganizationValue>;

export const UserOrganizationSettingsFormField = controlled<CreateUserOrganizationValue, Props>((
  {
    errors,
    control: { bind },
  },
) => {
  const t = useI18n().pack.users.form.fields.organization;
  const validation = useFormValidatorMessages({ errors });

  return (
    <>
      <FormField
        className="uk-margin"
        label={t.role.label}
        {...validation.extract('role')}
      >
        <UserOrganizationRoleSelect {...bind.path('role')} required />
      </FormField>

      <hr />
    </>
  );
});
