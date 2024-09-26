import { Redirect, Route, Switch } from 'wouter';

import { useSdkIsLoggedIn } from '@llm/sdk';
import {
  HomeRoute,
  LoginRoute,
  OrganizationsRoute,
  S3Route,
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
          <Redirect to={sitemap.login} />
        </Route>
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path={sitemap.home} component={HomeRoute} />
      <Route path={sitemap.organizations} component={OrganizationsRoute} />
      <Route path={sitemap.s3} component={S3Route} />
      <Route path={sitemap.users} component={UsersRoute} />
      <Route>
        <Redirect to={sitemap.home} />
      </Route>
    </Switch>
  );
}
