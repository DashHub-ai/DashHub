import { Redirect, Route, Switch } from 'wouter';

import { type SdkTableRowWithUuidT, useSdkIsLoggedIn } from '@llm/sdk';
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
      <Route<SdkTableRowWithUuidT> path={sitemap.chat.raw}>
        {params => <ChatRoute id={params.id} />}
      </Route>
      <Route>
        <Redirect to={sitemap.home} replace />
      </Route>
    </Switch>
  );
}
