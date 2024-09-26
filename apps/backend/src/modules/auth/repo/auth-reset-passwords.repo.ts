import { injectable } from 'tsyringe';

import { createDatabaseRepo } from '~/modules/database';

@injectable()
export class AuthResetPasswordsRepo extends createDatabaseRepo('auth_reset_passwords') {}
