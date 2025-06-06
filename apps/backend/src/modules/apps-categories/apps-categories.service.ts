import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { delay, inject, injectable } from 'tsyringe';

import type {
  SdkCreateAppCategoryInputT,
  SdkJwtTokenT,
  SdkTableRowIdT,
  SdkUpdateAppCategoryInputT,
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
import { AppsCategoriesFirewall } from './apps-categories.firewall';
import { AppsCategoriesRepo } from './apps-categories.repo';
import { AppsCategoriesEsIndexRepo, AppsCategoriesEsSearchRepo } from './elasticsearch';

@injectable()
export class AppsCategoriesService implements WithAuthFirewall<AppsCategoriesFirewall> {
  constructor(
    @inject(AppsCategoriesRepo) private readonly repo: AppsCategoriesRepo,
    @inject(AppsCategoriesEsSearchRepo) private readonly esSearchRepo: AppsCategoriesEsSearchRepo,
    @inject(AppsCategoriesEsIndexRepo) private readonly esIndexRepo: AppsCategoriesEsIndexRepo,
    @inject(delay(() => PermissionsService)) private readonly permissionsService: PermissionsService,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new AppsCategoriesFirewall(jwt, this, this.permissionsService);

  get = this.esSearchRepo.get;

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

  search = this.esSearchRepo.search;

  create = ({ parentCategory, organization, ...values }: SdkCreateAppCategoryInputT) => pipe(
    this.repo.create({
      value: {
        ...values,
        organizationId: organization.id,
        parentCategoryId: parentCategory?.id || null,
      },
    }),
    TE.tap(({ id }) => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  update = ({ id, parentCategory, ...value }: SdkUpdateAppCategoryInputT & TableRowWithId) => pipe(
    this.repo.update({
      id,
      value: {
        ...value,
        parentCategoryId: parentCategory?.id || null,
      },
    }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );
}
