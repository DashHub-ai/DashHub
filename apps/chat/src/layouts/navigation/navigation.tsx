import { Link } from 'wouter';

import { useSitemap } from '~/routes';

import { NavigationLinks } from './links';
import { NavigationLoggedAsBar } from './navigation-logged-as-bar';
import { NavigationRightToolbar } from './navigation-right-toolbar';
import { NavigationWorkspaceSelector } from './navigation-workspace-selector';

export function Navigation() {
  const sitemap = useSitemap();

  return (
    <header className="relative z-50 bg-white border-b border-border w-full">
      <NavigationLoggedAsBar />

      <div className="mx-auto px-4 container">
        <nav className="flex justify-between items-center h-16">
          <div className="flex flex-1 items-center gap-12">
            <Link
              className="font-semibold text-lg"
              to={sitemap.home}
            >
              DashHub
            </Link>

            <NavigationWorkspaceSelector />

            <NavigationLinks />
          </div>

          <NavigationRightToolbar />
        </nav>
      </div>
    </header>
  );
}
