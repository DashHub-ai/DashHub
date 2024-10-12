import { inject, injectable } from 'tsyringe';

import { BaseController } from '../shared';
import { AppsController } from './apps.controller';
import { OrganizationsController } from './organizations.controller';
import { ProjectsController } from './projects.controller';
import { S3BucketsController } from './s3-buckets.controller';
import { UsersController } from './users.controller';

@injectable()
export class DashboardController extends BaseController {
  constructor(
    @inject(OrganizationsController) organizations: OrganizationsController,
    @inject(UsersController) users: UsersController,
    @inject(ProjectsController) projects: ProjectsController,
    @inject(AppsController) apps: AppsController,
    @inject(S3BucketsController) s3Buckets: S3BucketsController,
  ) {
    super();

    this.router
      .route('/organizations', organizations.router)
      .route('/users', users.router)
      .route('/projects', projects.router)
      .route('/apps', apps.router)
      .route('/s3-buckets', s3Buckets.router);
  }
}
