import { injectable } from 'tsyringe';

import {
  createArchiveRecordQuery,
  createArchiveRecordsQuery,
  createDatabaseRepo,
  createUnarchiveRecordQuery,
  createUnarchiveRecordsQuery,
} from '~/modules/database';

@injectable()
export class OrganizationsRepo extends createDatabaseRepo('organizations') {
  readonly archive = createArchiveRecordQuery(this.queryFactoryAttrs);

  readonly archiveRecords = createArchiveRecordsQuery(this.queryFactoryAttrs);

  readonly unarchive = createUnarchiveRecordQuery(this.queryFactoryAttrs);

  readonly unarchiveRecords = createUnarchiveRecordsQuery(this.queryFactoryAttrs);
}
