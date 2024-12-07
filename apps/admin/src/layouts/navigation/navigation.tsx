import {
  BotIcon,
  BuildingIcon,
  CloudIcon,
  FolderIcon,
  GraduationCapIcon,
  HomeIcon,
  LayersIcon,
  UserIcon,
} from 'lucide-react';

import { useI18n } from '~/i18n';
import { SearchBar } from '~/modules';
import { useSitemap } from '~/routes';

import { ChooseLanguageItem } from './choose-language-item';
import { LoggedInUserItem } from './logged-in/logged-in-user-item';
import { NavigationGroup } from './navigation-group';
import { NavigationItem } from './navigation-item';

export function Navigation() {
  const t = useI18n().pack.navigation;
  const sitemap = useSitemap();

  const resourcesGroup = [
    {
      path: sitemap.organizations.index.raw,
      icon: <BuildingIcon size={16} />,
      label: t.links.organizations,
    },
    {
      path: sitemap.users.index.raw,
      icon: <UserIcon size={16} />,
      label: t.links.users,
    },
  ];

  const devToolsGroup = [
    {
      path: sitemap.apps.index.raw,
      icon: <BotIcon size={16} />,
      label: t.links.apps,
    },
    {
      path: sitemap.apps.categories.index.raw,
      icon: <FolderIcon size={16} />,
      label: t.links.appsCategories,
    },
    {
      path: sitemap.projects.index.raw,
      icon: <LayersIcon size={16} />,
      label: t.links.projects,
    },
  ];

  const aiGroup = [
    {
      path: sitemap.aiModels.index.raw,
      icon: <GraduationCapIcon size={16} />,
      label: t.links.aiModels,
    },
    {
      path: sitemap.s3Buckets.index.raw,
      icon: <CloudIcon size={16} />,
      label: t.links.s3Buckets,
    },
  ];

  return (
    <header className="top-0 z-50 sticky bg-white px-4 border-b border-border w-full">
      <div className="flex items-center mx-auto p-4 max-w-screen-2xl h-14 container">
        <nav className="w-full uk-navbar" uk-navbar="">
          <div className="uk-navbar-left gap-x-4 lg:gap-x-10">
            <div className="flex justify-start uk-navbar-item">
              <span className="font-light text-lg">
                DashHub
              </span>
            </div>

            <ul className="gap-4 uk-navbar-nav">
              <NavigationItem path={sitemap.home} icon={<HomeIcon size={16} />}>
                {t.links.home}
              </NavigationItem>

              <NavigationGroup
                icon={<BuildingIcon size={16} />}
                label={t.groups.resources}
                items={resourcesGroup}
              />

              <NavigationGroup
                icon={<FolderIcon size={16} />}
                label={t.groups.development}
                items={devToolsGroup}
              />

              <NavigationGroup
                icon={<GraduationCapIcon size={16} />}
                label={t.groups.aiAndStorage}
                items={aiGroup}
              />
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
