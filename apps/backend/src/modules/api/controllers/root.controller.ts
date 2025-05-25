import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { inject, injectable } from 'tsyringe';

import { AgentsLibraryAPIController } from '~/commercial/modules';
import { ConfigService } from '~/modules/config';

import { notFoundMiddleware } from '../middlewares';
import { AuthController } from './auth.controller';
import { DashboardController } from './dashboard';
import { HealthCheckController } from './health-check.controller';
import { BaseController } from './shared';

@injectable()
export class RootApiController extends BaseController {
  constructor(
    @inject(ConfigService) configService: ConfigService,
    @inject(HealthCheckController) healthCheck: HealthCheckController,
    @inject(AuthController) auth: AuthController,
    @inject(DashboardController) dashboard: DashboardController,
    @inject(AgentsLibraryAPIController) agentsLibrary: AgentsLibraryAPIController,
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
      .route('/dashboard', dashboard.router)
      .route('/agents-library', agentsLibrary.router)
      .all('*', notFoundMiddleware);
  }
}
