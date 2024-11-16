import { useI18n } from '~/i18n';
import { PageWithNavigationLayout } from '~/layouts';
import { RouteMetaTags } from '~/routes/shared';

import { ChooseOrganizationTutorial } from './choose-organization-tutorial';

export function ChooseOrganizationRoute() {
  const t = useI18n().pack.routes.chooseOrganization;

  return (
    <PageWithNavigationLayout>
      <RouteMetaTags meta={t.meta} />

      <section className="flex uk-flex-center pt-8">
        <ChooseOrganizationTutorial />
      </section>
    </PageWithNavigationLayout>
  );
}
