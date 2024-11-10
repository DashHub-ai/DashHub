import { UkIcon } from '@llm/ui';
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
          <div className="flex flex-1 items-center gap-10">
            <span className="font-semibold text-lg">DashHub</span>

            <ul className="flex items-center gap-4 ml-5">
              <NavigationItem path={sitemap.home} icon="message-square-text">
                {t.links.home}
              </NavigationItem>

              <NavigationItem path={sitemap.projects} icon="folder-kanban">
                {t.links.projects}
              </NavigationItem>

              <NavigationItem path={sitemap.apps} icon="wand-sparkles">
                {t.links.apps}
              </NavigationItem>

              <NavigationItem path={sitemap.experts} icon="graduation-cap">
                {t.links.experts}
              </NavigationItem>

              <NavigationItem path={sitemap.settings} icon="cog">
                {t.links.settings}
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
              <UkIcon
                icon="search"
                size={18}
                className="top-1/2 left-3 absolute text-gray-500 -translate-y-1/2"
              />
            </div>

            <button
              type="button"
              className="relative hover:bg-gray-100/80 p-3 rounded-full text-gray-800 hover:text-gray-900"
              title={t.notifications.title}
            >
              <UkIcon icon="bell" size={20} className="relative top-[1px]" />
              <span className="top-2 right-2 absolute bg-red-500 rounded-full w-2.5 h-2.5" />
            </button>

            <a
              href="https://github.com/DashHub-ai/DashHub"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:bg-gray-100/80 p-3 rounded-full text-gray-800 hover:text-gray-900"
              title={t.github}
            >
              <UkIcon icon="github" size={20} className="relative top-[1px]" />
            </a>

            <ChooseLanguageItem />

            <LoggedInUserItem />
          </div>
        </nav>
      </div>
    </header>
  );
}
