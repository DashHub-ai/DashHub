import { injectable } from 'tsyringe';

import { createDatabaseRepo } from '~/modules/database';

@injectable()
export class MessagesRepo extends createDatabaseRepo('messages') {}
