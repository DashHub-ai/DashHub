import { injectable } from 'tsyringe';

import { createDatabaseRepo } from '~/modules/database';

@injectable()
export class OrganizationsRepo extends createDatabaseRepo('organizations') {}
