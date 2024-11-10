import type { SdkAppT } from '@llm/sdk';

import { AppCard } from './app-card';

type Props = {
  items: SdkAppT[];
};

export function AppsGrid({ items }: Props) {
  return (
    <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {items.map(app => (
        <AppCard
          key={app.id}
          app={app}
        />
      ))}
    </div>
  );
}
