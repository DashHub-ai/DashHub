import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import { tapTaskEitherTE } from '@llm/commons';
import { LoggerService } from '~/modules/logger';
import { OrganizationsEsIndexRepo } from '~/modules/organizations/elasticsearch';
import { UsersEsIndexRepo } from '~/modules/users/elasticsearch/users-es-index.repo';

import { ElasticsearchIndicesRegistryRepo } from '../repo/elasticsearch-indices-registry.repo';

@injectable()
export class ElasticsearchRegistryBootService {
  private readonly logger = LoggerService.of('ElasticsearchRegistryBootService');

  constructor(
    @inject(ElasticsearchIndicesRegistryRepo) private readonly indicesRegistryRepo: ElasticsearchIndicesRegistryRepo,
    @inject(UsersEsIndexRepo) private readonly usersEsIndexRepo: UsersEsIndexRepo,
    @inject(OrganizationsEsIndexRepo) private readonly organizationsEsIndexRepo: OrganizationsEsIndexRepo,
  ) {}

  register = TE.fromIO(() => {
    this.indicesRegistryRepo.registerIndexRepos([
      this.usersEsIndexRepo,
      this.organizationsEsIndexRepo,
    ]);

    this.logger.info('Registered elasticsearch repos!');
  });

  registerAndReindexIfNeeded = () => pipe(
    this.register,
    tapTaskEitherTE(this.indicesRegistryRepo.reindexAllWithChangedSchema),
  );
}
