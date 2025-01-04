import type { AbstractNestedSdkWithAuthConfig } from '../abstract-nested-sdk-with-auth';

import { AIModelsSdk } from './ai-models';
import { AppsSdk } from './apps';
import { AppsCategoriesSdk } from './apps-categories';
import { ChatsSdk } from './chats';
import { ExpertsSdk } from './experts';
import { OrganizationsSdk } from './organizations';
import { ProjectsSdk } from './projects';
import { ProjectsEmbeddingsSdk } from './projects-embeddings';
import { ProjectsFilesSdk } from './projects-files';
import { S3BucketsSdk } from './s3-buckets';
import { UsersSdk } from './users';
import { UsersGroupsSdk } from './users-groups';

export class DashboardSdk {
  public readonly organizations = new OrganizationsSdk(this.config);

  public readonly users = new UsersSdk(this.config);

  public readonly usersGroups = new UsersGroupsSdk(this.config);

  public readonly projects = new ProjectsSdk(this.config);

  public readonly projectsFiles = new ProjectsFilesSdk(this.config);

  public readonly projectsEmbeddings = new ProjectsEmbeddingsSdk(this.config);

  public readonly apps = new AppsSdk(this.config);

  public readonly appsCategories = new AppsCategoriesSdk(this.config);

  public readonly experts = new ExpertsSdk(this.config);

  public readonly chats = new ChatsSdk(this.config);

  public readonly s3Buckets = new S3BucketsSdk(this.config);

  public readonly aiModels = new AIModelsSdk(this.config);

  constructor(private readonly config: AbstractNestedSdkWithAuthConfig) {}
}
