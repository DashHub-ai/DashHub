import type { ColumnType } from 'kysely';

import type { SdkUserRoleT } from '@llm/sdk';
import type {
  TableWithArchivedAtColumn,
  TableWithArchiveProtectionColumn,
  TableWithDefaultColumns,
} from '~/modules/database';

export type UsersTable = TableWithDefaultColumns &
  TableWithArchivedAtColumn &
  TableWithArchiveProtectionColumn & {
    jwt_refresh_token: ColumnType<string, never>;
    active: boolean;
    last_login_at: Date | null;
    email: string;
    role: SdkUserRoleT;
  };
