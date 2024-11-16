import { useSdkForLoggedIn } from '@llm/sdk';

import { useWorkspace } from './workspace-context';

export function useWorkspaceOrganization() {
  const { session: { token } } = useSdkForLoggedIn();
  const workspace = useWorkspace();

  const organization = (() => {
    switch (token.role) {
      case 'root':
        return workspace.organization;

      default:
        return token.organization;
    }
  })();

  return {
    organization,
    assignWorkspaceOrganization: <D extends object>(obj: D) => ({
      ...obj,
      ...organization && { organization },
    }),
  };
}
