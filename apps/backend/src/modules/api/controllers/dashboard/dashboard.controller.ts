import { inject, injectable } from 'tsyringe';

import { BaseController } from '../shared';
import { AIExternalAPIsController } from './ai-external-apis.controller';
import { AIModelsController } from './ai-models.controller';
import { AppsCategoriesController } from './apps-categories.controller';
import { AppsController } from './apps.controller';
import { ChatsController } from './chats.controller';
import { FavoritesController } from './favorites.controller';
import { OrganizationsController } from './organizations.controller';
import { PinnedMessagesController } from './pinned-messages.controller';
import { ProjectsController } from './projects.controller';
import { S3BucketsController } from './s3-buckets.controller';
import { SearchEnginesController } from './search-engines.controller';
import { ShareResourceController } from './share-resource.controller';
import { UsersGroupsController } from './users-groups.controller';
import { UsersMeController } from './users-me.controller';
import { UsersController } from './users.controller';

@injectable()
export class DashboardController extends BaseController {
  constructor(
    @inject(OrganizationsController) organizations: OrganizationsController,
    @inject(UsersController) users: UsersController,
    @inject(UsersGroupsController) usersGroups: UsersGroupsController,
    @inject(ProjectsController) projects: ProjectsController,
    @inject(AppsController) apps: AppsController,
    @inject(AppsCategoriesController) appsCategories: AppsCategoriesController,
    @inject(S3BucketsController) s3Buckets: S3BucketsController,
    @inject(ChatsController) chats: ChatsController,
    @inject(AIModelsController) aiModels: AIModelsController,
    @inject(ShareResourceController) shareResource: ShareResourceController,
    @inject(UsersMeController) usersMe: UsersMeController,
    @inject(SearchEnginesController) searchEngines: SearchEnginesController,
    @inject(PinnedMessagesController) pinnedMessages: PinnedMessagesController,
    @inject(FavoritesController) favorites: FavoritesController,
    @inject(AIExternalAPIsController) aiExternalAPIs: AIExternalAPIsController,
  ) {
    super();

    this.router
      .route('/organizations', organizations.router)
      .route('/users/groups', usersGroups.router)
      .route('/users/me', usersMe.router)
      .route('/users', users.router)
      .route('/projects', projects.router)
      .route('/apps/categories', appsCategories.router)
      .route('/apps', apps.router)
      .route('/s3-buckets', s3Buckets.router)
      .route('/chats', chats.router)
      .route('/ai-models', aiModels.router)
      .route('/ai-external-apis', aiExternalAPIs.router)
      .route('/search-engines', searchEngines.router)
      .route('/share-resource', shareResource.router)
      .route('/pinned-messages', pinnedMessages.router)
      .route('/favorites', favorites.router);
  }
}
