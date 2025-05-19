import type { SdkExpertT } from '@dashhub/sdk';

import { ExpertCard } from './expert-card';

type Props = {
  items: SdkExpertT[];
};

export function ExpertsGrid({ items }: Props) {
  return (
    <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {items.map(expert => (
        <ExpertCard
          key={expert.id}
          expert={expert}
        />
      ))}
    </div>
  );
}
