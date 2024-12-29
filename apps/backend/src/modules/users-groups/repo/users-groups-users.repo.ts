import { injectable } from 'tsyringe';

import { AbstractDatabaseRepo } from '~/modules/database';

@injectable()
export class UsersGroupsUsersRepo extends AbstractDatabaseRepo {
}
