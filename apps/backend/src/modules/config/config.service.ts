import { singleton } from 'tsyringe';

import type { AppEnvT } from '@dashhub/commons';

import { LoggerService } from '../logger';
import { tryReadEnvOrPanic } from './helpers';

@singleton()
export class ConfigService {
  private readonly logger = LoggerService.of('ConfigService');

  public readonly config = tryReadEnvOrPanic();

  constructor() {
    this.logger.info('Loaded config:', this.config);
  }

  isEnv = (env: AppEnvT) => this.config.env === env;
}
