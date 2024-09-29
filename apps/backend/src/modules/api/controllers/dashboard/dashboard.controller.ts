import { inject, injectable } from 'tsyringe';

import { BaseController } from '../shared';
import { OrganizationsController } from './organizations.controller';
import { UsersController } from './users.controller';

@injectable()
export class DashboardController extends BaseController {
  constructor(
    @inject(OrganizationsController) organizations: OrganizationsController,
    @inject(UsersController) users: UsersController,
  ) {
    super();

    this.router
      .route('/organizations', organizations.router)
      .route('/users', users.router);
  }
}
