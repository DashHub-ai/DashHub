import { ContentCard } from '@llm/ui';
import { useI18n } from '~/i18n';
import { S3BucketsTableContainer } from '~/modules';

import { ManagementLayout } from '../layout';

export function S3BucketsManagementRoute() {
  const t = useI18n().pack.routes.management.pages.s3Buckets;

  return (
    <ManagementLayout title={t.title}>
      <ContentCard title={t.title}>
        <S3BucketsTableContainer />
      </ContentCard>
    </ManagementLayout>
  );
}
