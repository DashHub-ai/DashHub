import {
  BellIcon,
  FolderKanbanIcon,
  GraduationCapIcon,
  HomeIcon,
  SearchIcon,
  WandSparklesIcon,
} from 'lucide-react';
import { Link } from 'wouter';

import { useI18n } from '~/i18n';
import { useSitemap } from '~/routes';

import { ChooseLanguageItem } from './choose-language-item';
import { LoggedInUserItem } from './logged-in/logged-in-user-item';
import { NavigationItem } from './navigation-item';

export function Navigation() {
  const t = useI18n().pack.navigation;
  const sitemap = useSitemap();

  return (
    <header className="relative z-50 bg-white border-b border-border w-full">
      <div className="mx-auto px-4 container">
        <nav className="flex justify-between items-center h-16">
          <div className="flex flex-1 items-center gap-8">
            <Link
              className="font-semibold text-lg"
              to={sitemap.home}
            >
              DashHub
            </Link>

            <ul className="flex items-center gap-4 ml-5">
              <NavigationItem path={sitemap.home} icon={<HomeIcon size={16} />}>
                {t.links.home}
              </NavigationItem>

              <NavigationItem path={sitemap.projects} icon={<FolderKanbanIcon size={16} />}>
                {t.links.projects}
              </NavigationItem>

              <NavigationItem path={sitemap.apps} icon={<WandSparklesIcon size={16} />}>
                {t.links.apps}
              </NavigationItem>

              <NavigationItem path={sitemap.experts} icon={<GraduationCapIcon size={16} />}>
                {t.links.experts}
              </NavigationItem>
            </ul>
          </div>

          {/* Right side items */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <input
                type="text"
                placeholder={t.search.placeholder}
                className="focus:border-gray-200 bg-gray-100/80 focus:bg-white py-2 pr-4 pl-10 border border-transparent rounded-full focus:ring-0 w-44 focus:w-64 text-gray-800 text-sm transition-all duration-200 placeholder-gray-500 focus:outline-none"
              />
              <SearchIcon
                size={18}
                className="top-1/2 left-3 absolute text-gray-500 -translate-y-1/2"
              />
            </div>

            <button
              type="button"
              className="relative hover:bg-gray-100/80 p-3 rounded-full text-gray-800 hover:text-gray-900"
              title={t.notifications.title}
            >
              <BellIcon size={20} className="relative top-[1px]" />
              <span className="top-2 right-2 absolute bg-red-500 rounded-full w-2.5 h-2.5" />
            </button>

            <ChooseLanguageItem />

            <LoggedInUserItem />
          </div>
        </nav>
      </div>
    </header>
  );
}
