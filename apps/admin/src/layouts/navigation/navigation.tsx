import clsx from 'clsx';
import { Link, useLocation } from 'wouter';

import { useI18n } from '~/i18n';
import { useSitemap } from '~/routes';

import { ChooseLanguageItem } from './choose-language-item';
import { LoggedInUserItem } from './logged-in/logged-in-user-item';
import { SearchBar } from './search-bar';

export function Navigation() {
  const t = useI18n().pack.navigation;
  const sitemap = useSitemap();
  const [location] = useLocation();

  const assignClassIfActive = (path: string) => ({
    className: clsx(location === path && 'uk-active'),
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border px-4">
      <div className="container mx-auto p-4 flex h-14 max-w-screen-2xl items-center">
        <nav className="uk-navbar w-full" uk-navbar="">
          <div className="uk-navbar-left gap-x-4 lg:gap-x-8">
            <div className="uk-navbar-item flex justify-start">
              <span className="font-light text-lg">
                DashHub
              </span>
            </div>

            <ul className="uk-navbar-nav gap-x-4 lg:gap-x-6">
              <li {...assignClassIfActive(sitemap.home)}>
                <Link href={sitemap.home}>{t.links.home}</Link>
              </li>

              <li {...assignClassIfActive(sitemap.organizations)}>
                <Link href={sitemap.organizations}>{t.links.organizations}</Link>
              </li>

              <li {...assignClassIfActive(sitemap.users)}>
                <Link href={sitemap.users}>{t.links.users}</Link>
              </li>

              <li {...assignClassIfActive(sitemap.s3)}>
                <Link href={sitemap.s3}>{t.links.s3}</Link>
              </li>
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
