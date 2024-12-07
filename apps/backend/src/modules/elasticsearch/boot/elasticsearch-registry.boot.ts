import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import { tapTaskEitherTE } from '@llm/commons';
import { AIModelsEsIndexRepo } from '~/modules/ai-models/elasticsearch/ai-models-es-index.repo';
import { AppsCategoriesEsIndexRepo } from '~/modules/apps-categories/elasticsearch/apps-categories-es-index.repo';
import { AppsEsIndexRepo } from '~/modules/apps/elasticsearch/apps-es-index.repo';
import { ChatsEsIndexRepo } from '~/modules/chats/elasticsearch/chats-es-index.repo';
import { LoggerService } from '~/modules/logger';
import { MessagesEsIndexRepo } from '~/modules/messages/elasticsearch/messages-es-index.repo';
import { OrganizationsEsIndexRepo } from '~/modules/organizations/elasticsearch';
import { OrganizationsS3BucketsEsIndexRepo } from '~/modules/organizations/s3-buckets/elasticsearch/organizations-s3-buckets-es-index.repo';
import { ProjectsEsIndexRepo } from '~/modules/projects/elasticsearch/projects-es-index.repo';
import { UsersEsIndexRepo } from '~/modules/users/elasticsearch/users-es-index.repo';

import { ElasticsearchIndicesRegistryRepo } from '../repo/elasticsearch-indices-registry.repo';

@injectable()
export class ElasticsearchRegistryBootService {
  private readonly logger = LoggerService.of('ElasticsearchRegistryBootService');

  constructor(
    @inject(ElasticsearchIndicesRegistryRepo) private readonly indicesRegistryRepo: ElasticsearchIndicesRegistryRepo,
    @inject(UsersEsIndexRepo) private readonly usersEsIndexRepo: UsersEsIndexRepo,
    @inject(OrganizationsEsIndexRepo) private readonly organizationsEsIndexRepo: OrganizationsEsIndexRepo,
    @inject(ProjectsEsIndexRepo) private readonly projectsEsIndexRepo: ProjectsEsIndexRepo,
    @inject(AppsEsIndexRepo) private readonly appsEsIndexRepo: AppsEsIndexRepo,
    @inject(OrganizationsS3BucketsEsIndexRepo) private readonly orgsS3BucketsEsIndexRepo: OrganizationsS3BucketsEsIndexRepo,
    @inject(AIModelsEsIndexRepo) private readonly aiModelsEsIndexRepo: AIModelsEsIndexRepo,
    @inject(ChatsEsIndexRepo) private readonly chatsEsIndexRepo: ChatsEsIndexRepo,
    @inject(MessagesEsIndexRepo) private readonly messagesEsIndexRepo: MessagesEsIndexRepo,
    @inject(AppsCategoriesEsIndexRepo) private readonly appsCategoriesEsIndexRepo: AppsCategoriesEsIndexRepo,
  ) {}

  register = TE.fromIO(() => {
    this.indicesRegistryRepo.registerIndexRepos([
      this.usersEsIndexRepo,
      this.organizationsEsIndexRepo,
      this.projectsEsIndexRepo,
      this.appsEsIndexRepo,
      this.orgsS3BucketsEsIndexRepo,
      this.aiModelsEsIndexRepo,
      this.chatsEsIndexRepo,
      this.messagesEsIndexRepo,
      this.appsCategoriesEsIndexRepo,
    ]);

    this.logger.info('Registered elasticsearch repos!');
  });

  registerAndReindexIfNeeded = () => pipe(
    this.register,
    tapTaskEitherTE(this.indicesRegistryRepo.reindexAllWithChangedSchema),
  );
}
