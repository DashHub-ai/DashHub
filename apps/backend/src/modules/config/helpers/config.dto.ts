import { z } from 'zod';

import { AppEnvV } from '@llm/commons';
import { HttpServerConfigV } from '~/modules/api/http-server.config';
import { AuthConfigV } from '~/modules/auth/auth.config';
import { DatabaseConfigV } from '~/modules/database/database.config';
import { DatabaseMigrateConfigV } from '~/modules/database/migrate/database-migrate.config';
import { ElasticsearchConfigV } from '~/modules/elasticsearch/elasticsearch.config';
import { UsersConfigV } from '~/modules/users/users.config';

export const ConfigV = z.object({
  env: AppEnvV,
  endUserDomain: z.string(),
  listen: HttpServerConfigV,
  elasticsearch: ElasticsearchConfigV,
  database: DatabaseConfigV.extend({
    migration: DatabaseMigrateConfigV,
  }),
  users: UsersConfigV,
  auth: AuthConfigV,
});

export type ConfigT = z.infer<typeof ConfigV>;
