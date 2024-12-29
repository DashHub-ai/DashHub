import { ContentCard } from '@llm/ui';
import { useI18n } from '~/i18n';
import { UsersGroupsTableContainer } from '~/modules/users-groups';

import { ManagementLayout } from '../layout';

export function UsersGroupsManagementRoute() {
  const t = useI18n().pack.routes.management.pages.usersGroups;

  return (
    <ManagementLayout title={t.title}>
      <ContentCard title={t.title}>
        <UsersGroupsTableContainer />
      </ContentCard>
    </ManagementLayout>
  );
}
