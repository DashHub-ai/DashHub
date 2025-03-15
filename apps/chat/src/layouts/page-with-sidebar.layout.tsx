import type { PropsWithChildren } from 'react';

import clsx from 'clsx';

import { ChatsHistorySidebarSection } from '~/modules/chats/sidebar/chats-history-sidebar-section';
import { ProjectsHistorySidebarSection } from '~/modules/projects/sidebar/projects-history-sidebar-section';
import { useWorkspaceOrganization } from '~/modules/workspace/use-workspace-organization';

import { Footer } from './footer';
import { Navigation } from './navigation';
import { Sidebar, useSidebarToggledStorage } from './sidebar';

type Props = PropsWithChildren & {
  withFooter?: boolean;
  backgroundClassName?: string;
  contentClassName?: string;
};

export function PageWithSidebarLayout(
  {
    children,
    contentClassName,
    backgroundClassName = 'bg-white',
    withFooter = true,
  }: Props,
) {
  const { organization } = useWorkspaceOrganization();
  const sidebarToggledStorage = useSidebarToggledStorage();
  const isSidebarVisible = !!sidebarToggledStorage.getOrNull();

  return (
    <main
      className={clsx(
        'min-h-screen',
        isSidebarVisible && '2xl:pl-[300px]',
        backgroundClassName,
      )}
      key={organization?.id ?? 'unknown'}
    >
      <Sidebar>
        {organization && (
          <>
            <ProjectsHistorySidebarSection />
            <ChatsHistorySidebarSection />
          </>
        )}
      </Sidebar>

      <div className="flex flex-col gap-8 2xl:px-16 min-h-screen">
        <Navigation />

        <div
          className={clsx(
            'flex-1 space-y-8 w-full',
            'container mx-auto',
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
