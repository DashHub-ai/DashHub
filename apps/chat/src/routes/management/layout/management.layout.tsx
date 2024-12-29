import type { PropsWithChildren } from 'react';

import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithNavigationLayout } from '~/layouts';
import { RouteMetaTags } from '~/routes';

type Props = PropsWithChildren & {
  title: string;
};

export function ManagementLayout({ title, children }: Props) {
  const t = useI18n().pack.routes.management;

  return (
    <PageWithNavigationLayout>
      <RouteMetaTags
        meta={{
          ...t.meta,
          title: `${t.title} | ${title}`,
        }}
      />

      <LayoutHeader>
        {t.title}
      </LayoutHeader>

      {children}
    </PageWithNavigationLayout>
  );
}
