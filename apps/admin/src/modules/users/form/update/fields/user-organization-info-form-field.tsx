import type { SdkExtractUserT } from '@llm/sdk';

import { FormField } from '~/components';
import { useI18n } from '~/i18n';
import { OrganizationsSearchSelect, UserOrganizationRoleSelect } from '~/modules/organizations';

type Props = {
  user: SdkExtractUserT<'user'>;
};

export function UserOrganizationInfoField({ user }: Props) {
  const t = useI18n().pack.modules.users.form.fields.organization;

  return (
    <>
      <FormField
        className="uk-margin"
        label={t.choose.label}
      >
        <OrganizationsSearchSelect
          defaultValue={user.organization}
          disabled
        />
      </FormField>

      <FormField
        className="uk-margin"
        label={t.role.label}
      >
        <UserOrganizationRoleSelect
          defaultValue={user.organization.role}
          disabled
        />
      </FormField>

      <hr />
    </>
  );
}
