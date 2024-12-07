import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkCreateAppInputT,
  SdkJwtTokenT,
  SdkTableRowIdT,
  SdkUpdateAppInputT,
} from '@llm/sdk';

import {
  asyncIteratorToVoidPromise,
  runTaskAsVoid,
  tapAsyncIterator,
  tryOrThrowTE,
} from '@llm/commons';

import type { WithAuthFirewall } from '../auth';
import type { TableId, TableRowWithId } from '../database';

import { AppsFirewall } from './apps.firewall';
import { AppsRepo } from './apps.repo';
import { AppsEsIndexRepo, AppsEsSearchRepo } from './elasticsearch';

@injectable()
export class AppsService implements WithAuthFirewall<AppsFirewall> {
  constructor(
    @inject(AppsRepo) private readonly repo: AppsRepo,
    @inject(AppsEsSearchRepo) private readonly esSearchRepo: AppsEsSearchRepo,
    @inject(AppsEsIndexRepo) private readonly esIndexRepo: AppsEsIndexRepo,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new AppsFirewall(jwt, this);

  get = this.esSearchRepo.get;

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

  search = this.esSearchRepo.search;

  create = ({ organization, category, ...values }: SdkCreateAppInputT) => pipe(
    this.repo.create({
      value: {
        ...values,
        organizationId: organization.id,
        categoryId: category.id,
      },
    }),
    TE.tap(({ id }) => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  update = ({ id, category, ...value }: SdkUpdateAppInputT & TableRowWithId) => pipe(
    this.repo.update({
      id,
      value: {
        ...value,
        categoryId: category.id,
      },
    }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );
}
