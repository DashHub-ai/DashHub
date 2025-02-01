import { useI18n } from '~/i18n';
import { UsersTableContainer } from '~/modules/users';
import { ContentCard } from '~/ui';

import { ManagementLayout } from '../layout';

export function UsersManagementRoute() {
  const t = useI18n().pack.routes.management.pages.users;

  return (
    <ManagementLayout title={t.title}>
      <ContentCard title={t.title}>
        <UsersTableContainer />
      </ContentCard>
    </ManagementLayout>
  );
}
