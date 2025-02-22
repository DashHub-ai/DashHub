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
import { PinnedMessagesEsIndexRepo } from '~/modules/pinned-messages/elasticsearch/pinned-messages-es-index.repo';
import { ProjectsEmbeddingsEsIndexRepo } from '~/modules/projects-embeddings/elasticsearch/projects-embeddings-es-index.repo';
import { ProjectsFilesEsIndexRepo } from '~/modules/projects-files/elasticsearch/projects-files-es-index.repo';
import { ProjectsEsIndexRepo } from '~/modules/projects/elasticsearch/projects-es-index.repo';
import { SearchEnginesEsIndexRepo } from '~/modules/search-engines';
import { UsersGroupsEsIndexRepo } from '~/modules/users-groups/elasticsearch/users-groups-es-index.repo';
import { UsersEsIndexRepo } from '~/modules/users/elasticsearch/users-es-index.repo';

import { ElasticsearchIndicesRegistryRepo } from '../repo/elasticsearch-indices-registry.repo';

@injectable()
export class ElasticsearchRegistryBootService {
  private readonly logger = LoggerService.of('ElasticsearchRegistryBootService');

  constructor(
    @inject(ElasticsearchIndicesRegistryRepo) private readonly indicesRegistryRepo: ElasticsearchIndicesRegistryRepo,
    @inject(UsersEsIndexRepo) private readonly usersEsIndexRepo: UsersEsIndexRepo,
    @inject(UsersGroupsEsIndexRepo) private readonly usersGroupsEsIndexRepo: UsersGroupsEsIndexRepo,
    @inject(OrganizationsEsIndexRepo) private readonly organizationsEsIndexRepo: OrganizationsEsIndexRepo,
    @inject(ProjectsEsIndexRepo) private readonly projectsEsIndexRepo: ProjectsEsIndexRepo,
    @inject(AppsEsIndexRepo) private readonly appsEsIndexRepo: AppsEsIndexRepo,
    @inject(OrganizationsS3BucketsEsIndexRepo) private readonly orgsS3BucketsEsIndexRepo: OrganizationsS3BucketsEsIndexRepo,
    @inject(AIModelsEsIndexRepo) private readonly aiModelsEsIndexRepo: AIModelsEsIndexRepo,
    @inject(ChatsEsIndexRepo) private readonly chatsEsIndexRepo: ChatsEsIndexRepo,
    @inject(MessagesEsIndexRepo) private readonly messagesEsIndexRepo: MessagesEsIndexRepo,
    @inject(AppsCategoriesEsIndexRepo) private readonly appsCategoriesEsIndexRepo: AppsCategoriesEsIndexRepo,
    @inject(ProjectsFilesEsIndexRepo) private readonly projectsFilesEsIndexRepo: ProjectsFilesEsIndexRepo,
    @inject(ProjectsEmbeddingsEsIndexRepo) private readonly projectsEmbeddingsEsIndexRepo: ProjectsEmbeddingsEsIndexRepo,
    @inject(SearchEnginesEsIndexRepo) private readonly searchEnginesEsIndexRepo: SearchEnginesEsIndexRepo,
    @inject(PinnedMessagesEsIndexRepo) private readonly pinnedMessagesEsIndexRepo: PinnedMessagesEsIndexRepo,
  ) {}

  register = TE.fromIO(() => {
    this.indicesRegistryRepo.registerIndexRepos([
      this.usersEsIndexRepo,
      this.usersGroupsEsIndexRepo,
      this.organizationsEsIndexRepo,
      this.projectsEsIndexRepo,
      this.appsEsIndexRepo,
      this.orgsS3BucketsEsIndexRepo,
      this.aiModelsEsIndexRepo,
      this.chatsEsIndexRepo,
      this.messagesEsIndexRepo,
      this.appsCategoriesEsIndexRepo,
      this.projectsFilesEsIndexRepo,
      this.projectsEmbeddingsEsIndexRepo,
      this.searchEnginesEsIndexRepo,
      this.pinnedMessagesEsIndexRepo,
    ]);

    this.logger.info('Registered elasticsearch repos!');
  });

  registerAndReindexIfNeeded = () => pipe(
    this.register,
    tapTaskEitherTE(this.indicesRegistryRepo.reindexAllWithChangedSchema),
  );
}
