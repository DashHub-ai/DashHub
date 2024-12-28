import { injectable } from 'tsyringe';

import { createDatabaseRepo } from '../database';

@injectable()
export class UsersGroupsRepo extends createDatabaseRepo('users_groups') {}
