import { useSdkForLoggedIn } from '@llm/sdk';

import { useWorkspaceOrganization } from './use-workspace-organization';

export function useHasWorkspaceOrganization() {
  const { organization } = useWorkspaceOrganization();
  const { session: { token } } = useSdkForLoggedIn();

  switch (token.role) {
    case 'root':
      return Boolean(organization);

    default:
      return true;
  }
}
