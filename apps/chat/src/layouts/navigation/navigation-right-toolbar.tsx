import { useHasWorkspaceOrganization } from '~/modules';
import { SearchBar } from '~/modules/search-bar';

import { ChooseLanguageItem } from './choose-language-item';
import { LoggedInUserItem } from './logged-in';

export function NavigationRightToolbar() {
  const hasWorkspace = useHasWorkspaceOrganization();

  return (
    <div className="flex items-center gap-4">
      <SearchBar disabled={!hasWorkspace} />

      <ChooseLanguageItem />

      <LoggedInUserItem />
    </div>
  );
}
