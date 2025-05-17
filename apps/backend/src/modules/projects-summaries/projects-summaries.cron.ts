import { flow } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import { runTaskAsVoid, tryOrThrowTE } from '@dashhub/commons';
import { ConfigService } from '~/modules/config';

import { CronJob, CronService } from '../cron';
import { LoggerService } from '../logger';
import { ProjectsSummariesService } from './projects-summaries.service';

@injectable()
export class ProjectSummariesCronJob extends CronJob {
  private readonly logger = LoggerService.of('ProjectSummariesCronJob');

  constructor(
    @inject(CronService) cronService: CronService,
    @inject(ConfigService) configService: ConfigService,
    @inject(ProjectsSummariesService) private readonly projectsSummariesService: ProjectsSummariesService,
  ) {
    super(cronService, configService);
  }

  registerCronJob(): void {
    const { logger } = this;
    const { cron } = this.config.projectsSummaries;

    if (!cron) {
      logger.warn('ProjectSummariesCronJob cron job is disabled!');
      return;
    }

    this.cronService.tryRegister(
      {
        expression: cron,
        skipIfPreviousJobNotDone: true,
      },
      flow(
        this.projectsSummariesService.summarizeAllProjects,
        tryOrThrowTE,
        runTaskAsVoid,
      ),
    );

    logger.info('Registered ProjectSummariesCronJob cron job!');
  }
}
