import { injectable } from 'tsyringe';

import { createDatabaseRepo } from '~/modules/database';

@injectable()
export class OrganizationsS3BucketsRepo extends createDatabaseRepo('organizations_s3_resources_buckets') {}
