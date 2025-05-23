import {
  controlled,
  useFormValidatorMessages,
  type ValidationErrorsListProps,
} from '@under-control/forms';

import type { SdkUpdateUserOrganizationInputT } from '@dashhub/sdk';

import { useI18n } from '~/i18n';
import { UserOrganizationRoleSelect } from '~/modules/organizations';
import { FormField } from '~/ui';

type Props = ValidationErrorsListProps<SdkUpdateUserOrganizationInputT>;

export const UserOrganizationSettingsFormField = controlled<SdkUpdateUserOrganizationInputT, Props>((
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
