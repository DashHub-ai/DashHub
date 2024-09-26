import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { inject, injectable } from 'tsyringe';

import { ConfigService } from '~/modules/config';

import { notFoundMiddleware } from '../middlewares';
import { AuthController } from './auth';
import { BaseController } from './base.controller';
import { HealthCheckController } from './health-check';

@injectable()
export class RootApiController extends BaseController {
  constructor(
    @inject(ConfigService) private readonly configService: ConfigService,
    @inject(HealthCheckController) private readonly healthCheck: HealthCheckController,
    @inject(AuthController) private readonly auth: AuthController,
  ) {
    super();

    const { config, isEnv } = this.configService;
    const corsOrigins = (
      isEnv('dev')
        ? '*'
        : [`https://www.${config.endUserDomain}`, `https://${config.endUserDomain}`]
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
      .route('/health-check', this.healthCheck.router)
      .route('/auth', this.auth.router)
      .all('*', notFoundMiddleware);
  }
}
