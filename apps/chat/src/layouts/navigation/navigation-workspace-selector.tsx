import { useLocation } from 'wouter';

import type { SdkIdNameUrlEntryT } from '@llm/sdk';

import { useI18n } from '~/i18n';
import { OrganizationsSearchSelect, useWorkspace } from '~/modules';
import { useSitemap } from '~/routes';

export function NavigationWorkspaceSelector() {
  const t = useI18n().pack;
  const sitemap = useSitemap();
  const [, navigate] = useLocation();
  const { organization, setOrganization } = useWorkspace();

  const onChangeOrganizationAndRedirect = (organization: SdkIdNameUrlEntryT | null) => {
    navigate(sitemap.home, { replace: true });
    setOrganization(organization);
  };

  return (
    <OrganizationsSearchSelect
      prefix={t.workspace.organization}
      placeholder={t.workspace.selectOrganization}
      value={organization}
      onChange={onChangeOrganizationAndRedirect}
    />
  );
}
