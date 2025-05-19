import { useSdkSubscribeMeOrThrow } from '@dashhub/sdk';
import { useI18n } from '~/i18n';
import { UpdateMeForm } from '~/modules';
import { ContentCard, SpinnerContainer } from '~/ui';

import { SettingsLayout } from '../layout';

export function MeSettingsRoute() {
  const t = useI18n().pack.routes.settings.pages.me;
  const value = useSdkSubscribeMeOrThrow();

  return (
    <SettingsLayout title={t.title}>
      <ContentCard title={t.title}>
        <SpinnerContainer loading={value.loading}>
          {() => !value.loading && <UpdateMeForm defaultValue={value.me} />}
        </SpinnerContainer>
      </ContentCard>
    </SettingsLayout>
  );
}
