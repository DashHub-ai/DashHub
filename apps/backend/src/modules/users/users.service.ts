import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type { SdkCreateUserInputT, SdkJwtTokenT, SdkTableRowIdT, SdkUpdateUserInputT } from '@llm/sdk';

import {
  asyncIteratorToVoidPromise,
  runTaskAsVoid,
  tapAsyncIterator,
  tryOrThrowTE,
} from '@llm/commons';

import type { WithAuthFirewall } from '../auth';

import { TableId, TableRowWithId } from '../database';
import { PermissionsService } from '../permissions';
import { UsersEsSearchRepo } from './elasticsearch';
import { UsersEsIndexRepo } from './elasticsearch/users-es-index.repo';
import { UsersFirewall } from './users.firewall';
import { UsersRepo } from './users.repo';

@injectable()
export class UsersService implements WithAuthFirewall<UsersFirewall> {
  constructor(
    @inject(UsersRepo) private readonly repo: UsersRepo,
    @inject(UsersEsIndexRepo) private readonly esIndexRepo: UsersEsIndexRepo,
    @inject(UsersEsSearchRepo) private readonly esSearchRepo: UsersEsSearchRepo,
    @inject(PermissionsService) private readonly permissionsService: PermissionsService,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new UsersFirewall(jwt, this, this.permissionsService);

  get = this.esSearchRepo.get;

  search = this.esSearchRepo.search;

  create = (value: SdkCreateUserInputT) => pipe(
    this.repo.create({ value }),
    TE.tap(({ id }) => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  update = ({ id, ...value }: SdkUpdateUserInputT & TableRowWithId) => pipe(
    this.repo.update({ id, value }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  createIfNotExists = (value: SdkCreateUserInputT) => pipe(
    this.repo.createIfNotExists({ value }),
    TE.tap(({ id, created }) =>
      created
        ? this.esIndexRepo.findAndIndexDocumentById(id)
        : TE.right(undefined),
    ),
  );

  unarchive = (id: SdkTableRowIdT) => pipe(
    this.repo.unarchive({ id }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  archive = (id: SdkTableRowIdT) => pipe(
    this.repo.archive({ id }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
    TE.tap(() => this.permissionsService.deleteUserExternalResourcesPermissions(id)),
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
}
