import { useI18n } from '~/i18n';
import { FullPageWithBrandLayout } from '~/layouts';

import { RouteMetaTags } from '../shared';
import { LoginForm } from './login.form';

export function LoginRoute() {
  const { pack } = useI18n();

  return (
    <>
      <RouteMetaTags meta={pack.routes.login.meta} />
      <FullPageWithBrandLayout>
        <LoginForm />
      </FullPageWithBrandLayout>
    </>
  );
}
