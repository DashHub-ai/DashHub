import { singleton } from 'tsyringe';

import type { AppEnvT } from '@dashhub/commons';

import { setLicenseKey } from '~/commercial/index';

import { LoggerService } from '../logger';
import { tryReadEnvOrPanic } from './helpers';

@singleton()
export class ConfigService {
  private readonly logger = LoggerService.of('ConfigService');

  public readonly config = tryReadEnvOrPanic();

  constructor() {
    const { logger, config } = this;

    logger.info('Loaded config:', config);

    if (config.licenseKey) {
      logger.info('✨ Thank you for using our premium version! We appreciate your support!');
      setLicenseKey(config.licenseKey);
    }
  }

  isEnv = (env: AppEnvT) => this.config.env === env;
}
