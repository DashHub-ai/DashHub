import { useHasWorkspaceOrganization } from '~/modules';
import { SearchBar } from '~/modules/search-bar';

export function NavigationRightToolbar() {
  const hasWorkspace = useHasWorkspaceOrganization();

  return (
    <div className="flex items-center gap-4">
      <SearchBar disabled={!hasWorkspace} />
    </div>
  );
}
