import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { delay, inject, injectable } from 'tsyringe';

import type {
  SdkCreateAIModelInputT,
  SdkJwtTokenT,
  SdkTableRowIdT,
  SdkUpdateAIModelInputT,
} from '@dashhub/sdk';

import {
  asyncIteratorToVoidPromise,
  runTaskAsVoid,
  tapAsyncIterator,
  tryOrThrowTE,
} from '@dashhub/commons';

import type { WithAuthFirewall } from '../auth';
import type { TableId, TableRowWithId } from '../database';

import { PermissionsService } from '../permissions';
import { AIModelsFirewall } from './ai-models.firewall';
import { AIModelsRepo } from './ai-models.repo';
import { AIModelsEsIndexRepo, AIModelsEsSearchRepo } from './elasticsearch';

@injectable()
export class AIModelsService implements WithAuthFirewall<AIModelsFirewall> {
  constructor(
    @inject(AIModelsRepo) private readonly repo: AIModelsRepo,
    @inject(AIModelsEsSearchRepo) private readonly esSearchRepo: AIModelsEsSearchRepo,
    @inject(AIModelsEsIndexRepo) private readonly esIndexRepo: AIModelsEsIndexRepo,
    @inject(delay(() => PermissionsService)) private readonly permissionsService: Readonly<PermissionsService>,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new AIModelsFirewall(jwt, this, this.permissionsService);

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
      tapAsyncIterator<TableId[]>(async ids =>
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

  getDefaultVision = this.esSearchRepo.getDefaultVision;

  search = this.esSearchRepo.search;

  create = (value: SdkCreateAIModelInputT) => pipe(
    this.repo.create({ value }),
    TE.tap(() => this.esIndexRepo.reindexAllOrganizationDocuments(value.organization.id)),
  );

  update = ({ id, ...value }: SdkUpdateAIModelInputT & TableRowWithId) => pipe(
    this.repo.update({ id, value }),
    TE.tap(({ organization }) => this.esIndexRepo.reindexAllOrganizationDocuments(organization.id)),
  );
}
