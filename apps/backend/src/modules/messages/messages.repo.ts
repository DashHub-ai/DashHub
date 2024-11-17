import { injectable } from 'tsyringe';

import { createProtectedDatabaseRepo } from '~/modules/database';

@injectable()
export class MessagesRepo extends createProtectedDatabaseRepo('messages') {
  createIdsIterator = this.baseRepo.createIdsIterator;
}
