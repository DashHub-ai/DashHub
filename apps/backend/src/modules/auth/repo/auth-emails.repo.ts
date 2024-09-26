import { injectable } from 'tsyringe';

import { createDatabaseRepo } from '~/modules/database';

@injectable()
export class AuthEmailsRepo extends createDatabaseRepo('auth_emails') {}
