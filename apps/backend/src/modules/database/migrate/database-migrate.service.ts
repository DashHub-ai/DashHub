import { Migrator } from 'kysely';
import { inject, injectable } from 'tsyringe';

import { COMMERCIAL_MIGRATIONS } from '~/commercial/index';
import { DB_MIGRATIONS } from '~/migrations';
import { LoggerService } from '~/modules/logger';

import { DatabaseConnectionRepo } from '../connection/database-connection.repo';
import { DatabaseMigrateError } from './database-migrate.error';

@injectable()
export class DatabaseMigrateService {
  private readonly logger = LoggerService.of('DatabaseMigrateService');

  constructor(
    @inject(DatabaseConnectionRepo) private readonly databaseConnection: DatabaseConnectionRepo,
  ) {}

  run = (direction: 'up' | 'down') => DatabaseMigrateError.tryTask(async () => {
    const { logger } = this;
    const { connection } = this.databaseConnection;

    logger.info('Running database migrations...');

    const migrator = new Migrator({
      db: connection,
      provider: {
        getMigrations: async () => Promise.resolve({
          ...DB_MIGRATIONS,
          ...COMMERCIAL_MIGRATIONS,
        }),
      },
    });

    const { error, results } = await (
      direction === 'down'
        ? migrator.migrateDown()
        : migrator.migrateToLatest()
    );

    results?.forEach((migration) => {
      switch (migration.status) {
        case 'Success':
          logger.info(
            `migration "${migration.migrationName}" was executed successfully`,
          );
          break;

        case 'Error':
          logger.error(
            `failed to execute migration "${migration.migrationName}"`,
          );
          break;
      }
    });

    if (error) {
      throw new DatabaseMigrateError(error);
    }
  });
}
