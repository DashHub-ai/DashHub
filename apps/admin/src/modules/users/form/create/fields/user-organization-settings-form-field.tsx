import {
  controlled,
  useFormValidatorMessages,
  type ValidationErrorsListProps,
} from '@under-control/forms';

import { FormField } from '~/components';
import { useI18n } from '~/i18n';

import type { CreateUserOrganizationValue } from '../types';

import { UserOrganizationRoleSelect } from '../../shared';

type Props = ValidationErrorsListProps<CreateUserOrganizationValue>;

export const UserOrganizationSettingsFormField = controlled<CreateUserOrganizationValue, Props>((
  {
    errors,
    control: { bind, value },
  },
) => {
  const t = useI18n().pack.modules.users.form.fields.organization;
  const validation = useFormValidatorMessages({ errors });

  // eslint-disable-next-line no-console
  console.info(errors, bind, value);

  return (
    <>
      <FormField
        className="uk-margin"
        label={t.role.label}
        {...validation.extract('role')}
      >
        <UserOrganizationRoleSelect {...bind.path('role')} />
      </FormField>

      <FormField
        className="uk-margin"
        label={t.choose.label}
      >
        Choose org
      </FormField>

      <hr />
    </>
  );
});
