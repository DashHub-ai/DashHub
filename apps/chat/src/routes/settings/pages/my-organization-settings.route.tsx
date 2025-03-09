import { pipe } from 'fp-ts/lib/function';
import { Redirect } from 'wouter';

import { tryOrThrowTE } from '@llm/commons';
import { useAsyncValue } from '@llm/commons-front';
import { useSdkForLoggedIn } from '@llm/sdk';
import { useI18n } from '~/i18n';
import { MyOrganizationForm, useWorkspaceOrganizationOrThrow } from '~/modules';
import { useSitemap } from '~/routes/use-sitemap';
import { ContentCard, SpinnerContainer } from '~/ui';

import { SettingsLayout } from '../layout';

export function MyOrganizationSettingsRoute() {
  const sitemap = useSitemap();
  const t = useI18n().pack.routes.settings.pages.myOrganization;

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
    return <Redirect to={sitemap.home} replace />;
  }

  return (
    <SettingsLayout title={t.title}>
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
    </SettingsLayout>
  );
}
