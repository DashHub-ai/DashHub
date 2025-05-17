import { flow } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import { runTaskAsVoid, tryOrThrowTE } from '@dashhub/commons';
import { ConfigService } from '~/modules/config';

import { CronJob, CronService } from '../cron';
import { LoggerService } from '../logger';
import { ChatsSummariesService } from './chats-summaries.service';

@injectable()
export class ChatSummariesCronJob extends CronJob {
  private readonly logger = LoggerService.of('ChatSummariesCronJob');

  constructor(
    @inject(CronService) cronService: CronService,
    @inject(ConfigService) configService: ConfigService,
    @inject(ChatsSummariesService) private readonly chatsSummariesService: ChatsSummariesService,
  ) {
    super(cronService, configService);
  }

  registerCronJob(): void {
    const { logger } = this;
    const { cron } = this.config.chatsSummaries;

    if (!cron) {
      logger.warn('ChatSummariesCronJob cron job is disabled!');
      return;
    }

    this.cronService.tryRegister(
      {
        expression: cron,
        skipIfPreviousJobNotDone: true,
      },
      flow(
        this.chatsSummariesService.summarizeAllChats,
        tryOrThrowTE,
        runTaskAsVoid,
      ),
    );

    logger.info('Registered ChatSummariesCronJob cron job!');
  }
}
