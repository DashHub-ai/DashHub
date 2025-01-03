import { Redirect, Route, Switch } from 'wouter';

import { type SdkTableRowWithUuidT, useSdkIsLoggedIn } from '@llm/sdk';
import {
  AppsEditorRoute,
  AppsRoute,
  ChatRoute,
  ChooseOrganizationRoute,
  ExpertsRoute,
  ForceRedirectRoute,
  HomeRoute,
  LoginRoute,
  ManagementRoute,
  ProjectRoute,
  ProjectsRoute,
  SettingsRoute,
  UsersGroupsManagementRoute,
  UsersManagementRoute,
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
      <Route<SdkTableRowWithUuidT> path={sitemap.projects.show.raw}>
        {params => <ProjectRoute id={+params.id} />}
      </Route>

      <Route path={sitemap.projects.index} component={ProjectsRoute} />
      <Route path={sitemap.apps.editor.raw} component={AppsEditorRoute} />
      <Route path={sitemap.apps.index} component={AppsRoute} />
      <Route path={sitemap.experts} component={ExpertsRoute} />
      <Route path={sitemap.settings} component={SettingsRoute} />
      <Route path={sitemap.management.users} component={UsersManagementRoute} />
      <Route path={sitemap.management.usersGroups} component={UsersGroupsManagementRoute} />
      <Route path={sitemap.management.index} component={ManagementRoute} />
      <Route path={sitemap.forceRedirect.raw} component={ForceRedirectRoute} />

      <Route<SdkTableRowWithUuidT> path={sitemap.chat.raw}>
        {params => <ChatRoute id={params.id} />}
      </Route>
      <Route>
        <Redirect to={sitemap.home} replace />
      </Route>
    </Switch>
  );
}
