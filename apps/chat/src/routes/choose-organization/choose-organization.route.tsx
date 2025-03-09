import { useI18n } from '~/i18n';
import { PageWithSidebarLayout } from '~/layouts';
import { OrganizationsTableContainer, UsersTableContainer } from '~/modules';
import { RouteMetaTags } from '~/routes/shared';

import { ChooseOrganizationTutorial } from './choose-organization-tutorial';

export function ChooseOrganizationRoute() {
  const t = useI18n().pack.routes.chooseOrganization;

  return (
    <PageWithSidebarLayout>
      <RouteMetaTags meta={t.meta} />

      <ChooseOrganizationTutorial />

      <section>
        <h2 className="mb-6 font-bold text-2xl line-clamp-1 tracking-tight">
          {t.sections.organizations}
        </h2>

        <OrganizationsTableContainer />
      </section>

      <hr />

      <section>
        <h2 className="mb-6 font-bold text-2xl line-clamp-1 tracking-tight">
          {t.sections.users}
        </h2>

        <UsersTableContainer
          filters={{
            roles: ['root'],
          }}
        />
      </section>
    </PageWithSidebarLayout>
  );
}
