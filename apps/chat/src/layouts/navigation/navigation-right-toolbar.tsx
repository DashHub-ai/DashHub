import type { PropsWithChildren } from 'react';

import { useHasWorkspaceOrganization } from '~/modules';
import { SearchBar } from '~/modules/search-bar';

export function NavigationRightToolbar({ children }: PropsWithChildren) {
  const hasWorkspace = useHasWorkspaceOrganization();

  return (
    <div className="flex items-center gap-4">
      {children}
      <SearchBar disabled={!hasWorkspace} />
    </div>
  );
}
