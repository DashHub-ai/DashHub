import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkCreateAppCategoryInputT,
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

import { AppsCategoriesFirewall } from './apps-categories.firewall';
import { AppsCategoriesRepo } from './apps-categories.repo';
import { AppsCategoriesEsIndexRepo, AppsCategoriesEsSearchRepo } from './elasticsearch';

@injectable()
export class AppsCategoriesService implements WithAuthFirewall<AppsCategoriesFirewall> {
  constructor(
    @inject(AppsCategoriesRepo) private readonly repo: AppsCategoriesRepo,
    @inject(AppsCategoriesEsSearchRepo) private readonly esSearchRepo: AppsCategoriesEsSearchRepo,
    @inject(AppsCategoriesEsIndexRepo) private readonly esIndexRepo: AppsCategoriesEsIndexRepo,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new AppsCategoriesFirewall(jwt, this);

  get = this.esSearchRepo.get;

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

  create = ({ parentCategory, ...values }: SdkCreateAppCategoryInputT) => pipe(
    this.repo.create({
      value: {
        ...values,
        parentCategoryId: parentCategory?.id || null,
      },
    }),
    TE.tap(({ id }) => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  update = ({ id, ...value }: SdkUpdateAppInputT & TableRowWithId) => pipe(
    this.repo.update({ id, value }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );
}
