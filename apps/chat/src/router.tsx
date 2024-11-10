import { Redirect, Route, Switch } from 'wouter';

import { useSdkIsLoggedIn } from '@llm/sdk';
import {
  AppsRoute,
  ExpertsRoute,
  HomeRoute,
  LoginRoute,
  ProjectsRoute,
  SettingsRoute,
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
      <Route path={sitemap.projects} component={ProjectsRoute} />
      <Route path={sitemap.apps} component={AppsRoute} />
      <Route path={sitemap.experts} component={ExpertsRoute} />
      <Route path={sitemap.settings} component={SettingsRoute} />
      <Route>
        <Redirect to={sitemap.home} />
      </Route>
    </Switch>
  );
}
