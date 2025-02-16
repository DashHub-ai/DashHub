import { inject, injectable } from 'tsyringe';

import { BaseController } from '../shared';
import { AIModelsController } from './ai-models.controller';
import { AppsCategoriesController } from './apps-categories.controller';
import { AppsController } from './apps.controller';
import { ChatsController } from './chats.controller';
import { OrganizationsController } from './organizations.controller';
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
      .route('/search-engines', searchEngines.router)
      .route('/share-resource', shareResource.router);
  }
}
