import type { PropsWithChildren } from 'react';

import clsx from 'clsx';

import { ChatsHistorySidebarSection } from '~/modules/chats/sidebar/chats-history-sidebar-section';
import { useWorkspaceOrganization } from '~/modules/workspace/use-workspace-organization';

import { Footer } from './footer';
import { Navigation } from './navigation';
import {
  Sidebar,
} from './sidebar';

type Props = PropsWithChildren & {
  withFooter?: boolean;
  wrapWithContainer?: boolean;
  backgroundClassName?: string;
  contentClassName?: string;
};

export function PageWithSidebarLayout(
  {
    children,
    contentClassName,
    backgroundClassName = 'bg-white',
    wrapWithContainer = true,
    withFooter = true,
  }: Props,
) {
  const { organization } = useWorkspaceOrganization();

  return (
    <main
      className={clsx('grid grid-cols-[auto_1fr] min-h-screen', backgroundClassName)}
      key={organization?.id ?? 'unknown'}
    >
      <Sidebar>
        {organization && <ChatsHistorySidebarSection />}
      </Sidebar>

      <div className="flex flex-col">
        <Navigation />

        <div
          className={clsx(
            'space-y-8 p-6 w-full',
            wrapWithContainer && 'container max-w-6xl mx-auto',
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
