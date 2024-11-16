import { useI18n } from '~/i18n';
import { OrganizationsSearchSelect, useWorkspace } from '~/modules';

export function NavigationWorkspaceSelector() {
  const t = useI18n().pack;
  const { organization, setOrganization } = useWorkspace();

  return (
    <OrganizationsSearchSelect
      prefix={t.workspace.organization}
      placeholder={t.workspace.selectOrganization}
      value={organization}
      onChange={setOrganization}
    />
  );
}
