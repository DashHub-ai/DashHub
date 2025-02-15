import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { delay, inject, injectable } from 'tsyringe';

import type {
  SdkCreateSearchEngineInputT,
  SdkJwtTokenT,
  SdkTableRowIdT,
  SdkUpdateSearchEngineInputT,
} from '@llm/sdk';

import {
  asyncIteratorToVoidPromise,
  runTaskAsVoid,
  tapAsyncIterator,
  tryOrThrowTE,
} from '@llm/commons';

import type { WithAuthFirewall } from '../auth';
import type { TableId, TableRowWithId } from '../database';

import { PermissionsService } from '../permissions';
import { SearchEnginesEsIndexRepo, SearchEnginesEsSearchRepo } from './elasticsearch';
import { SearchEnginesFirewall } from './search-engines.firewall';
import { SearchEnginesRepo } from './search-engines.repo';

@injectable()
export class SearchEnginesService implements WithAuthFirewall<SearchEnginesFirewall> {
  constructor(
    @inject(SearchEnginesRepo) private readonly repo: SearchEnginesRepo,
    @inject(SearchEnginesEsSearchRepo) private readonly esSearchRepo: SearchEnginesEsSearchRepo,
    @inject(SearchEnginesEsIndexRepo) private readonly esIndexRepo: SearchEnginesEsIndexRepo,
    @inject(delay(() => PermissionsService)) private readonly permissionsService: Readonly<PermissionsService>,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new SearchEnginesFirewall(jwt, this, this.permissionsService);

  archiveSeqByOrganizationId = (organizationId: SdkTableRowIdT) => TE.fromTask(
    pipe(
      this.repo.createIdsIterator({
        where: [['organizationId', '=', organizationId]],
        chunkSize: 100,
      }),
      this.archiveSeqStream,
    ),
  );

  archiveSeqStream = (stream: AsyncIterableIterator<TableId[]>) => async () =>
    pipe(
      stream,
      tapAsyncIterator<TableId[], void>(async ids =>
        pipe(
          this.repo.archiveRecords({
            where: [
              ['id', 'in', ids],
              ['archived', '=', false],
            ],
          }),
          TE.tap(() => this.esIndexRepo.findAndIndexDocumentsByIds(ids)),
          tryOrThrowTE,
          runTaskAsVoid,
        ),
      ),
      asyncIteratorToVoidPromise,
    );

  unarchive = (id: SdkTableRowIdT) => pipe(
    this.repo.unarchive({ id }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  archive = (id: SdkTableRowIdT) => pipe(
    this.repo.archive({ id }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  get = this.esSearchRepo.get;

  getDefault = this.esSearchRepo.getDefault;

  search = this.esSearchRepo.search;

  create = (value: SdkCreateSearchEngineInputT) => pipe(
    this.repo.create({ value }),
    TE.tap(() => this.esIndexRepo.reindexAllOrganizationDocuments(value.organization.id)),
  );

  update = ({ id, ...value }: SdkUpdateSearchEngineInputT & TableRowWithId) => pipe(
    this.repo.update({ id, value }),
    TE.tap(({ organization }) => this.esIndexRepo.reindexAllOrganizationDocuments(organization.id)),
  );
}
