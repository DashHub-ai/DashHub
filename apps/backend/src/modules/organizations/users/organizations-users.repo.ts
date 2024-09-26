import { injectable } from 'tsyringe';

import { createDatabaseRepo } from '~/modules/database';

@injectable()
export class OrganizationsUsersRepo extends createDatabaseRepo('organizations_users') {}
