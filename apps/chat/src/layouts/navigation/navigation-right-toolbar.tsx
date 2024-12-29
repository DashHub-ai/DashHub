import clsx from 'clsx';
import { SearchIcon } from 'lucide-react';

import { useI18n } from '~/i18n';
import { useHasWorkspaceOrganization } from '~/modules';

import { ChooseLanguageItem } from './choose-language-item';
import { LoggedInUserItem } from './logged-in';

export function NavigationRightToolbar() {
  const t = useI18n().pack.navigation;
  const hasWorkspace = useHasWorkspaceOrganization();

  return (
    <div className="flex items-center gap-4">
      <div
        className={clsx(
          'relative group',
          !hasWorkspace && 'pointer-events-none opacity-50',
        )}
      >
        <input
          type="text"
          placeholder={t.search.placeholder}
          className="focus:border-gray-200 bg-gray-100/80 focus:bg-white py-2 pr-4 pl-10 border border-transparent rounded-full focus:ring-0 w-44 focus:w-64 text-gray-800 text-sm transition-all duration-200 focus:outline-none placeholder-gray-500"
        />

        <SearchIcon
          size={18}
          className="top-1/2 left-3 absolute text-gray-500 -translate-y-1/2"
        />
      </div>

      <ChooseLanguageItem />

      <LoggedInUserItem />
    </div>
  );
}
