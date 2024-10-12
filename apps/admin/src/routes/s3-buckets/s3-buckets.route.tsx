import { useI18n } from '~/i18n';
import { LayoutHeader, PageWithNavigationLayout } from '~/layouts';
import { S3BucketsTableContainer } from '~/modules';

import { RouteMetaTags } from '../shared';

export function S3BucketsRoute() {
  const t = useI18n().pack.routes.s3Buckets;

  return (
    <>
      <RouteMetaTags meta={t.meta} />
      <PageWithNavigationLayout>
        <LayoutHeader>
          {t.title}
        </LayoutHeader>

        <S3BucketsTableContainer />
      </PageWithNavigationLayout>
    </>
  );
}
