import type { PropsWithChildren, ReactNode } from 'react';

import { useI18n } from '~/i18n';

type Props = PropsWithChildren<{
  suffix?: ReactNode;
}>;

export function AppsCategoriesSidebarLayout({ children, suffix }: Props) {
  const t = useI18n().pack.apps.grid.sidebar;

  return (
    <div className="pr-6 border-r border-border w-80">
      <h3 className="flex items-center gap-2 mb-4 font-medium">
        <span>{t.header}</span>
        {suffix}
      </h3>
      {children}
    </div>
  );
}
