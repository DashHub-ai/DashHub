import { useI18n } from '~/i18n';
import { useSitemap } from '~/routes';

import { ChooseLanguageItem } from './choose-language-item';
import { LoggedInUserItem } from './logged-in/logged-in-user-item';
import { NavigationItem } from './navigation-item';
import { SearchBar } from './search-bar';

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
              <NavigationItem path={sitemap.home} icon="home">
                {t.links.home}
              </NavigationItem>

              <NavigationItem path={sitemap.users.index.raw} icon="user">
                {t.links.users}
              </NavigationItem>

              <NavigationItem path={sitemap.apps.index.raw} icon="bot">
                {t.links.apps}
              </NavigationItem>

              <NavigationItem path={sitemap.projects.index.raw} icon="folder">
                {t.links.projects}
              </NavigationItem>

              <NavigationItem path={sitemap.organizations.index.raw} icon="building">
                {t.links.organizations}
              </NavigationItem>

              <NavigationItem path={sitemap.s3.index.raw} icon="cloud">
                {t.links.s3}
              </NavigationItem>
            </ul>
          </div>

          <div className="uk-navbar-right gap-x-4 lg:gap-x-6">
            <SearchBar />
            <ChooseLanguageItem />
            <LoggedInUserItem />
          </div>
        </nav>
      </div>
    </header>
  );
}
