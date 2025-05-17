import { pipe } from 'fp-ts/lib/function';
import { Redirect } from 'wouter';

import { tryOrThrowTE } from '@dashhub/commons';
import { useAsyncValue } from '@dashhub/commons-front';
import { useSdkForLoggedIn } from '@dashhub/sdk';
import { useI18n } from '~/i18n';
import { MyOrganizationForm, useWorkspaceOrganizationOrThrow } from '~/modules';
import { useSitemap } from '~/routes/use-sitemap';
import { ContentCard, SpinnerContainer } from '~/ui';

import { ManagementLayout } from '../layout';

export function OrganizationManagementRoute() {
  const sitemap = useSitemap();
  const t = useI18n().pack.routes.management.pages.organization;

  const { sdks } = useSdkForLoggedIn();
  const { organization } = useWorkspaceOrganizationOrThrow();

  const result = useAsyncValue(
    pipe(
      sdks.dashboard.organizations.get(organization.id),
      tryOrThrowTE,
    ),
    [],
  );

  if (result.status === 'error') {
    return <Redirect to={sitemap.management.index} replace />;
  }

  return (
    <ManagementLayout title={t.title}>
      <ContentCard title={t.title}>
        <SpinnerContainer loading={result.isLoading}>
          {() => {
            if (result.status === 'success') {
              return <MyOrganizationForm defaultValue={result.data} />;
            }
            return null;
          }}
        </SpinnerContainer>
      </ContentCard>
    </ManagementLayout>
  );
}
