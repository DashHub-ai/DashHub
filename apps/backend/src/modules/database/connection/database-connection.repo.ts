import type { ClientConfig as PgClientConfig } from 'pg';

import { isEmpty } from 'fp-ts/lib/Record';
import { Kysely, PostgresDialect } from 'kysely';
import pg from 'pg';
import Cursor from 'pg-cursor';
import { inject, singleton } from 'tsyringe';

import { ConfigService } from '~/modules/config';
import { LoggerService } from '~/modules/logger';

import type { DatabaseTables } from '../database.tables';

import { DatabaseError } from '../errors';
import { isSilentDbLog } from './is-silent-db-log';

@singleton()
export class DatabaseConnectionRepo {
  private readonly logger = LoggerService.of('DatabaseConnectionRepo');

  public readonly connection: Kysely<DatabaseTables>;

  constructor(
    @inject(ConfigService) private readonly configService: ConfigService,
  ) {
    this.connection = this.createConnection();
  }

  close = DatabaseError.tryTask(async () => {
    await this.connection.destroy();
  });

  private createConnection() {
    const { configService } = this;
    const config = configService.config.database;

    const pgConfig: PgClientConfig = {
      host: config.hostname,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.name,
    };

    return new Kysely<DatabaseTables>({
      dialect: new PostgresDialect({
        pool: new pg.Pool(pgConfig),
        cursor: Cursor,
      }),
      log: (event) => {
        if (configService.isEnv('dev') && !isSilentDbLog(event)) {
          const { sql, parameters } = event.query;

          this.logger.info(
            sql,
            !parameters || isEmpty(parameters as any)
              ? {}
              : { parameters },
          );
        }
      },
    });
  }
}
