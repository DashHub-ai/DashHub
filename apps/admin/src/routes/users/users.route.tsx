import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithNavigationLayout } from '~/layouts';
import { UsersTableContainer } from '~/modules/users';

import { RouteMetaTags } from '../shared';

export function UsersRoute() {
  const t = useI18n().pack.routes.users;

  return (
    <>
      <RouteMetaTags meta={t.meta} />
      <PageWithNavigationLayout>
        <LayoutHeader>
          {t.title}
        </LayoutHeader>

        <UsersTableContainer />
      </PageWithNavigationLayout>
    </>
  );
}
