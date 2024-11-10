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

            <ul className="flex items-center gap-4">
              <NavigationItem path={sitemap.home} icon="message-square-text">
                {t.links.home}
              </NavigationItem>

              <NavigationItem path={sitemap.projects} icon="folder-kanban">
                {t.links.projects}
              </NavigationItem>

              <NavigationItem path={sitemap.apps} icon="app-window">
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
            <ChooseLanguageItem />
            <LoggedInUserItem />
          </div>
        </nav>
      </div>
    </header>
  );
}
