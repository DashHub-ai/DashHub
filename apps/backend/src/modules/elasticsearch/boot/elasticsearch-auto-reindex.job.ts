import { flow } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import { runTaskAsVoid, tryOrThrowTE } from '@llm/commons';
import { ConfigService } from '~/modules/config';

import { CronJob, CronService } from '../../cron';
import { LoggerService } from '../../logger';
import { ElasticsearchIndicesRegistryRepo } from '../repo';

/**
 * Elasticsearch sync mappings cron job.
 */
@injectable()
export class ElasticsearchAutoReindexJob extends CronJob {
  private readonly logger = LoggerService.of('ElasticsearchAutoReindexJob');

  constructor(
    @inject(CronService) cronService: CronService,
    @inject(ConfigService) configService: ConfigService,
    @inject(ElasticsearchIndicesRegistryRepo) private readonly indicesRegistryRepo: ElasticsearchIndicesRegistryRepo,
  ) {
    super(cronService, configService);
  }

  registerCronJob(): void {
    const { logger } = this;
    const { cron } = this.config.elasticsearch.syncMappings;

    if (!cron) {
      logger.warn('Elasticsearch sync mappings cron job is disabled!');
      return;
    }

    this.cronService.tryRegister(
      {
        expression: cron,
        skipIfPreviousJobNotDone: true,
      },
      flow(
        this.indicesRegistryRepo.reindexAll,
        tryOrThrowTE,
        runTaskAsVoid,
      ),
    );

    logger.info('Registered Elasticsearch sync mappings cron job!');
  }
}
