import { inject, injectable } from 'tsyringe';

import { BaseController } from '../shared';
import { OrganizationsController } from './organizations.controller';
import { ProjectsController } from './projects.controller';
import { UsersController } from './users.controller';

@injectable()
export class DashboardController extends BaseController {
  constructor(
    @inject(OrganizationsController) organizations: OrganizationsController,
    @inject(UsersController) users: UsersController,
    @inject(ProjectsController) projects: ProjectsController,
  ) {
    super();

    this.router
      .route('/organizations', organizations.router)
      .route('/users', users.router)
      .route('/projects', projects.router);
  }
}
