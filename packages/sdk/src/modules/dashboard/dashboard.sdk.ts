import type { AbstractNestedSdkWithAuthConfig } from '../abstract-nested-sdk-with-auth';

import { OrganizationsSdk } from './organizations';
import { ProjectsSdk } from './projects';
import { UsersSdk } from './users';

export class DashboardSdk {
  public readonly organizations = new OrganizationsSdk(this.config);

  public readonly users = new UsersSdk(this.config);

  public readonly projects = new ProjectsSdk(this.config);

  constructor(private readonly config: AbstractNestedSdkWithAuthConfig) {}
}
