import { z } from 'zod';

import { AppEnvV } from '@dashhub/commons';
import { HttpServerConfigV } from '~/modules/api/http-server.config';
import { AuthConfigV } from '~/modules/auth/auth.config';
import { ChatsSummariesConfigV } from '~/modules/chats-summaries/chats-summaries.config';
import { DatabaseConfigV } from '~/modules/database/database.config';
import { DatabaseMigrateConfigV } from '~/modules/database/migrate/database-migrate.config';
import { ElasticsearchConfigV } from '~/modules/elasticsearch/elasticsearch.config';
import { ProjectsSummariesConfigV } from '~/modules/projects-summaries/projects-summaries.config';
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
  chatsSummaries: ChatsSummariesConfigV,
  projectsSummaries: ProjectsSummariesConfigV,
  licenseKey: z.string().optional(),
});

export type ConfigT = z.infer<typeof ConfigV>;
