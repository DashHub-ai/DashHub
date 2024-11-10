import { useI18n } from '~/i18n';
import { useSitemap } from '~/routes';

import { ChooseLanguageItem } from './choose-language-item';
import { LoggedInUserItem } from './logged-in/logged-in-user-item';
import { NavigationItem } from './navigation-item';

export function Navigation() {
  const t = useI18n().pack.navigation;
  const sitemap = useSitemap();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white">
      <div className="container mx-auto px-4">
        <nav className="flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center gap-10">
            <span className="text-lg font-semibold">DashHub</span>

            <ul className="flex items-center gap-2">
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
