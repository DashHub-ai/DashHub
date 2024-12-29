import { useI18n } from '~/i18n';

import { ManagementLayout } from '../layout';

export function UsersGroupsManagementRoute() {
  const t = useI18n().pack.routes.management.pages.usersGroups;

  return (
    <ManagementLayout title={t.title}>
      {t.title}
    </ManagementLayout>
  );
}
