import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { inject, injectable } from 'tsyringe';

import { ConfigService } from '~/modules/config';

import { notFoundMiddleware } from '../middlewares';
import { AuthController } from './auth.controller';
import { HealthCheckController } from './health-check.controller';
import { OrganizationsController } from './organizations.controller';
import { BaseController } from './shared';
import { UsersController } from './users.controller';

@injectable()
export class RootApiController extends BaseController {
  constructor(
    @inject(ConfigService) configService: ConfigService,
    @inject(HealthCheckController) healthCheck: HealthCheckController,
    @inject(AuthController) auth: AuthController,
    @inject(OrganizationsController) organizations: OrganizationsController,
    @inject(UsersController) users: UsersController,
  ) {
    super();

    const { config, isEnv } = configService;
    const corsOrigins = (
      isEnv('dev')
        ? '*'
        : [
            `https://www.${config.endUserDomain}`,
            `https://${config.endUserDomain}`,
          ]
    );

    this.router
      .use(
        '*',
        logger(),
        cors({
          origin: corsOrigins,
          allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
          allowHeaders: ['Content-Type', 'Authorization'],
          exposeHeaders: ['Content-Length'],
          maxAge: 600,
        }),
      )
      .route('/health-check', healthCheck.router)
      .route('/auth', auth.router)
      .route('/organizations', organizations.router)
      .route('/users', users.router)
      .all('*', notFoundMiddleware);
  }
}
