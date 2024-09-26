import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import { inject, injectable } from 'tsyringe';

import { tapTaskEitherTE } from '@llm/commons';

import { LoggerService } from '../../logger';
import { UsersEsIndexRepo } from '../../users/elasticsearch/users-es-index.repo';
import { ElasticsearchIndicesRegistryRepo } from '../repo/elasticsearch-indices-registry.repo';

@injectable()
export class ElasticsearchRegistryBootService {
  private readonly logger = LoggerService.of('ElasticsearchRegistryBootService');

  constructor(
    @inject(ElasticsearchIndicesRegistryRepo) private readonly indicesRegistryRepo: ElasticsearchIndicesRegistryRepo,
    @inject(UsersEsIndexRepo) private readonly usersEsIndexRepo: UsersEsIndexRepo,
  ) {}

  register = TE.fromIO(() => {
    this.indicesRegistryRepo.registerIndexRepos([
      this.usersEsIndexRepo,
    ]);

    this.logger.info('Registered elasticsearch repos!');
  });

  registerAndReindexIfNeeded = () => pipe(
    this.register,
    tapTaskEitherTE(this.indicesRegistryRepo.reindexAllWithChangedSchema),
  );
}
