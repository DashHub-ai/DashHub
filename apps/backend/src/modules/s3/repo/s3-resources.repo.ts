import { injectable } from 'tsyringe';

import { createDatabaseRepo } from '~/modules/database';

@injectable()
export class S3ResourcesRepo extends createDatabaseRepo('s3_resources') {}
