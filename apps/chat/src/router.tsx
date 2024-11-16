import { Redirect, Route, Switch } from 'wouter';

import { useSdkIsLoggedIn } from '@llm/sdk';
import {
  AppsRoute,
  ChatRoute,
  ChooseOrganizationRoute,
  ExpertsRoute,
  HomeRoute,
  LoginRoute,
  ProjectsRoute,
  SettingsRoute,
  useSitemap,
} from '~/routes';

import { useHasWorkspaceOrganization, useWorkspace } from './modules';

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

  return <LoggedInRouter />;
}

function LoggedInRouter() {
  const sitemap = useSitemap();
  const hasOrganization = useHasWorkspaceOrganization();
  const workspace = useWorkspace();

  if (!hasOrganization) {
    return (
      <Switch>
        <Route path={sitemap.home} component={ChooseOrganizationRoute} />
        <Route>
          <Redirect to={sitemap.home} replace />
        </Route>
      </Switch>
    );
  }

  return (
    <Switch key={workspace.organization?.id ?? '-'}>
      <Route path={sitemap.home} component={HomeRoute} />
      <Route path={sitemap.projects} component={ProjectsRoute} />
      <Route path={sitemap.apps} component={AppsRoute} />
      <Route path={sitemap.experts} component={ExpertsRoute} />
      <Route path={sitemap.settings} component={SettingsRoute} />
      <Route path={sitemap.chat.raw} component={ChatRoute} />
      <Route>
        <Redirect to={sitemap.home} replace />
      </Route>
    </Switch>
  );
}
