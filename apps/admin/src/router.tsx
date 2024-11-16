import { Redirect, Route, Switch } from 'wouter';

import { useSdkIsLoggedIn } from '@llm/sdk';
import {
  AIModelsRoute,
  AppsRoute,
  ForceRedirectRoute,
  HomeRoute,
  LoginRoute,
  OrganizationsRoute,
  ProjectsRoute,
  S3BucketsRoute,
  UsersRoute,
  useSitemap,
} from '~/routes';

export function Router() {
  const sitemap = useSitemap();
  const isLoggedIn = useSdkIsLoggedIn();

  if (!isLoggedIn) {
    return (
      <Switch>
        <Route path={sitemap.login} component={LoginRoute} />
        <Route>
          <Redirect to={sitemap.login} replace />
        </Route>
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path={sitemap.home} component={HomeRoute} />
      <Route path={sitemap.apps.index.raw} component={AppsRoute} />
      <Route path={sitemap.projects.index.raw} component={ProjectsRoute} />
      <Route path={sitemap.users.index.raw} component={UsersRoute} />
      <Route path={sitemap.organizations.index.raw} component={OrganizationsRoute} />
      <Route path={sitemap.s3Buckets.index.raw} component={S3BucketsRoute} />
      <Route path={sitemap.aiModels.index.raw} component={AIModelsRoute} />
      <Route path={sitemap.forceRedirect.raw} component={ForceRedirectRoute} />
      <Route>
        <Redirect to={sitemap.home} replace />
      </Route>
    </Switch>
  );
}
