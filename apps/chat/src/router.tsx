import { Redirect, Route, Switch } from 'wouter';

import { useSdkIsLoggedIn } from '@llm/sdk';
import {
  LoginRoute,
  ProjectsRoute,
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
      <Route path={sitemap.projects} component={ProjectsRoute} />
      <Route>
        <Redirect to={sitemap.projects} />
      </Route>
    </Switch>
  );
}
