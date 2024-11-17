import { injectable } from 'tsyringe';

import { createDatabaseRepo } from '~/modules/database';

@injectable()
export class ChatsSummariesRepo extends createDatabaseRepo('chat_summaries') {
}
