import { injectable } from 'tsyringe';

import { createDatabaseRepo } from '~/modules/database';

@injectable()
export class S3ResourcesImagesRepo extends createDatabaseRepo('s3_resources_images') {}
