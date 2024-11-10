import { useI18n } from '~/i18n';
import { useSitemap } from '~/routes';

import { ChooseLanguageItem } from './choose-language-item';
import { LoggedInUserItem } from './logged-in/logged-in-user-item';
import { NavigationItem } from './navigation-item';

export function Navigation() {
  const t = useI18n().pack.navigation;
  const sitemap = useSitemap();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border px-4 bg-white">
      <div className="container mx-auto p-4 flex h-14 max-w-screen-2xl items-center">
        <nav className="uk-navbar w-full" uk-navbar="">
          <div className="uk-navbar-left gap-x-4 lg:gap-x-10">
            <div className="uk-navbar-item flex justify-start">
              <span className="font-light text-lg">
                DashHub
              </span>
            </div>

            <ul className="uk-navbar-nav gap-x-4 lg:gap-x-8">
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

          <div className="uk-navbar-right gap-x-4 lg:gap-x-6">
            <ChooseLanguageItem />
            <LoggedInUserItem />
          </div>
        </nav>
      </div>
    </header>
  );
}
