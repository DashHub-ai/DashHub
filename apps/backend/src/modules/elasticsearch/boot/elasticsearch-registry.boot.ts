import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import { tapTaskEitherTE } from '@llm/commons';
import { AppsEsIndexRepo } from '~/modules/apps/elasticsearch/apps-es-index.repo';
import { LoggerService } from '~/modules/logger';
import { OrganizationsEsIndexRepo } from '~/modules/organizations/elasticsearch';
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
  ) {}

  register = TE.fromIO(() => {
    this.indicesRegistryRepo.registerIndexRepos([
      this.usersEsIndexRepo,
      this.organizationsEsIndexRepo,
      this.projectsEsIndexRepo,
      this.appsEsIndexRepo,
    ]);

    this.logger.info('Registered elasticsearch repos!');
  });

  registerAndReindexIfNeeded = () => pipe(
    this.register,
    tapTaskEitherTE(this.indicesRegistryRepo.reindexAllWithChangedSchema),
  );
}
