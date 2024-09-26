import { inject } from 'tsyringe';

import { ConfigService } from '../config/config.service';
import { CronService } from './cron.service';

/**
 * Interface that represents a cron job that will be registered on boot.
 */
export abstract class CronJob {
  constructor(
    @inject(CronService) protected readonly cronService: CronService,
    @inject(ConfigService) protected readonly configService: ConfigService,
  ) {}

  /**
   * Returns the cron job name.
   */
  protected get config() {
    return this.configService.config;
  }

  /**
   * Registers the cron job.
   */
  abstract registerCronJob(): void;
};
