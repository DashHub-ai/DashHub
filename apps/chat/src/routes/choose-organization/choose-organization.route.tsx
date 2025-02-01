import { useI18n } from '~/i18n';
import { PageWithNavigationLayout } from '~/layouts';
import { OrganizationsTableContainer } from '~/modules';
import { RouteMetaTags } from '~/routes/shared';

import { ChooseOrganizationTutorial } from './choose-organization-tutorial';

export function ChooseOrganizationRoute() {
  const t = useI18n().pack.routes.chooseOrganization;

  return (
    <PageWithNavigationLayout>
      <RouteMetaTags meta={t.meta} />

      <ChooseOrganizationTutorial />

      <OrganizationsTableContainer />
    </PageWithNavigationLayout>
  );
}
