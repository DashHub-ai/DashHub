import type { task as T } from 'fp-ts';

import { serve } from '@hono/node-server';
import { showRoutes } from 'hono/dev';
import { inject, injectable } from 'tsyringe';

import { ConfigService } from '../config';
import { LoggerService } from '../logger';
import { RootApiController } from './controllers';

@injectable()
export class HttpServerService {
  private readonly logger = LoggerService.of('HttpServerService');

  constructor(
    @inject(ConfigService) private readonly configService: ConfigService,
    @inject(RootApiController) private readonly rootController: RootApiController,
  ) {}

  run: T.Task<void> = () => new Promise((resolve) => {
    const { logger } = this;
    const { hostname, port } = this.configService.config.listen;
    const { router } = this.rootController;

    logger.info('Starting http server...');

    showRoutes(router, {
      verbose: true,
    });

    serve(
      {
        fetch: router.fetch,
        port,
        hostname,
      },
      () => {
        logger.info(`Http server is running at http://${hostname}:${port}!`);
        resolve();
      },
    );
  });
}
