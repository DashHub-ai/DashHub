import {
  controlled,
  useFormValidatorMessages,
  type ValidationErrorsListProps,
} from '@under-control/forms';

import type { SdkTableRowWithIdNameT, SdkUpdateUserOrganizationInputT } from '@llm/sdk';

import { FormField } from '@llm/ui';
import { useI18n } from '~/i18n';
import { OrganizationsSearchSelect, UserOrganizationRoleSelect } from '~/modules/organizations';

type Props = ValidationErrorsListProps<SdkUpdateUserOrganizationInputT> & {
  organization: SdkTableRowWithIdNameT;
};

export const UserOrganizationSettingsFormField = controlled<SdkUpdateUserOrganizationInputT, Props>((
  {
    organization,
    errors,
    control: { bind },
  },
) => {
  const t = useI18n().pack.modules.users.form.fields.organization;
  const validation = useFormValidatorMessages({ errors });

  return (
    <>
      <FormField
        className="uk-margin"
        label={t.choose.label}
      >
        <OrganizationsSearchSelect
          defaultValue={organization}
          disabled
        />
      </FormField>

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
