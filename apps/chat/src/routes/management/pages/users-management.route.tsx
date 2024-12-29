import { useI18n } from '~/i18n';

import { ManagementLayout } from '../layout';

export function UsersManagementRoute() {
  const t = useI18n().pack.routes.management.pages.users;

  return (
    <ManagementLayout title={t.title}>
      {t.title}
    </ManagementLayout>
  );
}
