import { Loader2Icon } from 'lucide-react';

import { Skeleton } from '~/ui';

import { AppsCategoriesSidebarLayout } from './apps-categories-sidebar-layout';

export function AppsCategoriesSidebarLoader() {
  return (
    <AppsCategoriesSidebarLayout
      suffix={(
        <Loader2Icon
          size={16}
          className="animate-spin"
        />
      )}
    >
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            className="rounded-md w-full h-8"
          />
        ))}
      </div>
    </AppsCategoriesSidebarLayout>
  );
}
