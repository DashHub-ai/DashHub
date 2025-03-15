import { Redirect, Route, Switch } from 'wouter';

import { type SdkTableRowWithUuidT, useSdkIsLoggedIn } from '@llm/sdk';
import {
  AIModelsManagementRoute,
  AppsRoute,
  ChatRoute,
  ChatsRoute,
  ChooseOrganizationRoute,
  CreateAppRoute,
  ExpertsRoute,
  ForceRedirectRoute,
  HomeRoute,
  LoginRoute,
  ManagementRoute,
  MeSettingsRoute,
  MyOrganizationSettingsRoute,
  OrganizationManagementRoute,
  PinnedMessagesRoute,
  ProjectRoute,
  ProjectsRoute,
  S3BucketsManagementRoute,
  SearchEnginesManagementRoute,
  SettingsRoute,
  UpdateAppRoute,
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
        <Route path={sitemap.settings.me} component={MeSettingsRoute} />
        <Route path={sitemap.settings.index} component={SettingsRoute} />

        <Route>
          <Redirect to={sitemap.home} replace />
        </Route>
      </Switch>
    );
  }

  return (
    <Switch key={workspace.organization?.id ?? '-'}>
      <Route path={sitemap.home} component={HomeRoute} />
      <Route path={sitemap.chats.index} component={ChatsRoute} />
      <Route<SdkTableRowWithUuidT> path={sitemap.projects.show.raw}>
        {params => <ProjectRoute id={+params.id} />}
      </Route>

      <Route path={sitemap.projects.index.raw} component={ProjectsRoute} />
      <Route path={sitemap.apps.create.raw} component={CreateAppRoute} />
      <Route<SdkTableRowWithUuidT> path={sitemap.apps.update.raw}>
        {params => <UpdateAppRoute id={+params.id} />}
      </Route>
      <Route path={sitemap.apps.index.raw} component={AppsRoute} />
      <Route path={sitemap.experts} component={ExpertsRoute} />

      <Route path={sitemap.settings.me} component={MeSettingsRoute} />
      <Route path={sitemap.settings.organization} component={MyOrganizationSettingsRoute} />
      <Route path={sitemap.settings.index} component={SettingsRoute} />

      <Route path={sitemap.pinnedMessages.index.raw} component={PinnedMessagesRoute} />

      <Route path={sitemap.management.organization} component={OrganizationManagementRoute} />
      <Route path={sitemap.management.s3Buckets} component={S3BucketsManagementRoute} />
      <Route path={sitemap.management.aiModels} component={AIModelsManagementRoute} />
      <Route path={sitemap.management.searchEngines} component={SearchEnginesManagementRoute} />
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
