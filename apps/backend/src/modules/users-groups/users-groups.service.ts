import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { delay, inject, injectable } from 'tsyringe';

import type {
  SdkCreateUsersGroupInputT,
  SdkJwtTokenT,
  SdkUpdateUsersGroupInputT,
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
import { UsersGroupsEsIndexRepo, UsersGroupsEsSearchRepo } from './elasticsearch';
import { UsersGroupsRepo } from './repo/users-groups.repo';
import { UsersGroupsFirewall } from './users-groups.firewall';

@injectable()
export class UsersGroupsService implements WithAuthFirewall<UsersGroupsFirewall> {
  constructor(
    @inject(UsersGroupsRepo) private readonly repo: UsersGroupsRepo,
    @inject(UsersGroupsEsSearchRepo) private readonly esSearchRepo: UsersGroupsEsSearchRepo,
    @inject(UsersGroupsEsIndexRepo) private readonly esIndexRepo: UsersGroupsEsIndexRepo,
    @inject(delay(() => PermissionsService)) private readonly permissionsService: Readonly<PermissionsService>,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new UsersGroupsFirewall(jwt, this, this.permissionsService);

  get = this.esSearchRepo.get;

  search = this.esSearchRepo.search;

  unarchive = (id: TableId) => pipe(
    this.repo.unarchive({ id }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  archive = (id: TableId) => pipe(
    this.repo.archive({ id }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  archiveSeqByOrganizationId = (organizationId: TableId) => TE.fromTask(
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

  create = (
    value: SdkCreateUsersGroupInputT & {
      creator: TableRowWithId;
    },
  ) => pipe(
    this.repo.create({
      value,
    }),
    TE.tap(({ id }) => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  update = ({ id, ...value }: SdkUpdateUsersGroupInputT & TableRowWithId) => pipe(
    this.repo.update({ id, value }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );
}
