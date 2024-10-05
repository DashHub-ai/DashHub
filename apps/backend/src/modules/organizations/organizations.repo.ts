import { injectable } from 'tsyringe';

import {
  createArchiveRecordQuery,
  createArchiveRecordsQuery,
  createDatabaseRepo,
} from '~/modules/database';

@injectable()
export class OrganizationsRepo extends createDatabaseRepo('organizations') {
  readonly archive = createArchiveRecordQuery(this.queryFactoryAttrs);

  readonly archiveRecords = createArchiveRecordsQuery(this.queryFactoryAttrs);
}
