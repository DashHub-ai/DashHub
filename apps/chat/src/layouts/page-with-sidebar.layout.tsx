import type { PropsWithChildren } from 'react';

import clsx from 'clsx';

import {
  AppsHistorySidebarSection,
  ChatsHistorySidebarSection,
  FavoriteAppsSidebarSection,
  FavoriteChatsSidebarSection,
  NewChatSidebarButton,
  ProjectsHistorySidebarSection,
} from '~/modules';
import { useWorkspaceOrganization } from '~/modules/workspace/use-workspace-organization';

import { Footer } from './footer';
import { Navigation, type NavigationProps } from './navigation';
import { Sidebar, useSidebarToggledStorage } from './sidebar';

type Props = PropsWithChildren & {
  withFooter?: boolean;
  backgroundClassName?: string;
  contentClassName?: string;
  contentSpaceClassName?: string;
  navigationProps?: NavigationProps;
};

export function PageWithSidebarLayout(
  {
    children,
    contentClassName,
    backgroundClassName = 'bg-white',
    contentSpaceClassName,
    withFooter = true,
    navigationProps,
  }: Props,
) {
  const { organization } = useWorkspaceOrganization();
  const sidebarToggledStorage = useSidebarToggledStorage();
  const isSidebarVisible = !!sidebarToggledStorage.getOrNull();

  return (
    <main
      className={clsx(
        'min-h-screen',
        isSidebarVisible && organization && '2xl:pl-[300px]',
        backgroundClassName,
      )}
      key={organization?.id ?? 'unknown'}
    >
      {organization && (
        <Sidebar>
          <NewChatSidebarButton />
          <hr className="my-3" />
          <FavoriteAppsSidebarSection />
          <FavoriteChatsSidebarSection />
          <ProjectsHistorySidebarSection />
          <AppsHistorySidebarSection />
          <ChatsHistorySidebarSection />
        </Sidebar>
      )}

      <div
        className={clsx(
          'flex flex-col 2xl:px-16 min-h-screen',
          !isSidebarVisible && organization && '2xl:pl-8',
        )}
      >
        <Navigation
          className="mb-4"
          {...navigationProps}
        />

        <div
          className={clsx(
            'flex-1 mb-4 last:mb-0 w-full',
            'container mx-auto',
            contentSpaceClassName ?? 'space-y-10',
            contentClassName,
          )}
        >
          {children}
        </div>

        {withFooter && <Footer />}
      </div>
    </main>
  );
}
