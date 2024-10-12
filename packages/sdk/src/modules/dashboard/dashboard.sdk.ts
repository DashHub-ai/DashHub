import type { AbstractNestedSdkWithAuthConfig } from '../abstract-nested-sdk-with-auth';

import { AppsSdk } from './apps';
import { OrganizationsSdk } from './organizations';
import { ProjectsSdk } from './projects';
import { S3BucketsSdk } from './s3-buckets';
import { UsersSdk } from './users';

export class DashboardSdk {
  public readonly organizations = new OrganizationsSdk(this.config);

  public readonly users = new UsersSdk(this.config);

  public readonly projects = new ProjectsSdk(this.config);

  public readonly apps = new AppsSdk(this.config);

  public readonly s3Buckets = new S3BucketsSdk(this.config);

  constructor(private readonly config: AbstractNestedSdkWithAuthConfig) {}
}
