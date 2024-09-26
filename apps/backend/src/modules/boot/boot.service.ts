import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import { runTask, tapTaskEither, tryOrThrowTE } from '@llm/commons';

import { HttpServerService } from '../api';
import { ConfigService } from '../config';
import { DatabaseMigrateService } from '../database';
import {
  ElasticsearchAutoReindexJob,
  ElasticsearchRegistryBootService,
} from '../elasticsearch/boot';
import { LoggerService } from '../logger';
import { UsersBootService } from '../users';

@injectable()
export class BootService {
  private readonly logger = LoggerService.of('BootService');

  constructor(
    // Normal services
    @inject(ConfigService) private readonly configService: ConfigService,
    @inject(HttpServerService) private readonly httpServerService: HttpServerService,
    @inject(DatabaseMigrateService) private readonly databaseMigrateService: DatabaseMigrateService,

    // Boot services
    @inject(UsersBootService) private readonly usersBootService: UsersBootService,
    @inject(ElasticsearchRegistryBootService) private readonly esRegistryBootService: ElasticsearchRegistryBootService,

    // Cron jobs
    @inject(ElasticsearchAutoReindexJob) private readonly elasticsearchReindexJob: ElasticsearchAutoReindexJob,
  ) {}

  /**
   * Boot the application, initialize services in proper order and register cron jobs.
   */
  public async boot() {
    const { logger } = this;
    const { config } = this.configService;

    logger.info('Booting application...');

    pipe(
      config.database.migration.checkMigrationsOnStartup
        ? this.databaseMigrateService.run('up')
        : TE.of(void 0),
      TE.chainTaskK(() => this.httpServerService.run),
      tapTaskEither(this.registerCronJobs),
      TE.chainW(this.usersBootService.ensureRootUserExists),
      TE.chainW(this.esRegistryBootService.registerAndReindexIfNeeded),
      tapTaskEither(() => {
        logger.info('Application booted successfully!');
      }),
      tryOrThrowTE,
      runTask,
    );
  }

  /**
   * Register cron jobs.
   */
  private registerCronJobs = () => {
    this.elasticsearchReindexJob.registerCronJob();
    this.logger.info('Registered cron jobs!');
  };
}
