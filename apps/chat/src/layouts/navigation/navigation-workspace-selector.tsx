import { useLocation } from 'wouter';

import { type SdkIdNameUrlEntryT, useSdkForLoggedIn } from '@llm/sdk';
import { useI18n } from '~/i18n';
import { OrganizationsSearchSelect, useWorkspace, useWorkspaceOrganizationOrThrow } from '~/modules';
import { useSitemap } from '~/routes';

type Props = {
  className?: string;
};

export function NavigationWorkspaceSelector({ className }: Props) {
  const t = useI18n().pack;
  const sitemap = useSitemap();
  const [, navigate] = useLocation();

  const { guard } = useSdkForLoggedIn();
  const { setOrganization } = useWorkspace();
  const { organization } = useWorkspaceOrganizationOrThrow();

  const onChangeOrganizationAndRedirect = (organization: SdkIdNameUrlEntryT | null) => {
    navigate(sitemap.home, { replace: true });
    setOrganization(organization);
  };

  if (guard.is.root) {
    return (
      <OrganizationsSearchSelect
        className={className}
        prefix={t.workspace.organization}
        placeholder={t.workspace.selectOrganization}
        value={organization}
        onChange={onChangeOrganizationAndRedirect}
      />
    );
  }

  return (
    <div className={`flex items-center gap-2 px-4 py-2 border rounded-md text-sm ${className}`}>
      <span className="text-muted-foreground">
        {t.workspace.organization}
        :
      </span>
      <span>{organization.name}</span>
    </div>
  );
}
