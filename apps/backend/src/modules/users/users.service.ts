import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { delay, inject, injectable } from 'tsyringe';

import type { SdkCreateUserInputT, SdkJwtTokenT, SdkTableRowIdT, SdkUpdateUserInputT } from '@llm/sdk';

import {
  asyncIteratorToVoidPromise,
  type DistributiveOverwrite,
  runTaskAsVoid,
  tapAsyncIterator,
  tryOrThrowTE,
} from '@llm/commons';

import type { ExtractedFile } from '../api/helpers';
import type { WithAuthFirewall } from '../auth';

import { TableId, TableRowWithId } from '../database';
import { OrganizationsS3BucketsRepo } from '../organizations';
import { PermissionsService } from '../permissions';
import { S3Service } from '../s3';
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
    @inject(S3Service) private readonly s3Service: S3Service,
    @inject(delay(() => OrganizationsS3BucketsRepo)) private readonly organizationsS3BucketsRepo: Readonly<OrganizationsS3BucketsRepo>,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new UsersFirewall(jwt, this, this.permissionsService);

  get = this.esSearchRepo.get;

  getFirstRootUser = this.repo.getFirstRootUser;

  search = this.esSearchRepo.search;

  create = ({ avatar, ...value }: InternalCreateUserInputT) => pipe(
    TE.Do,
    TE.bind('s3Resource', () => {
      if (!avatar || value.role === 'root') {
        return TE.of(null);
      }

      if ('id' in avatar) {
        return TE.of(avatar);
      }

      return pipe(
        this.organizationsS3BucketsRepo.getDefaultS3Bucket({
          organizationId: value.organization.item.id,
        }),
        TE.chainW(s3Bucket => this.s3Service.uploadFile({
          bucketId: s3Bucket.id,
          buffer: avatar.buffer,
          mimeType: avatar.mimeType,
          fileName: avatar.fileName,
        })),
      );
    }),
    TE.chainW(({ s3Resource }) => this.repo.create({
      value: {
        ...value,
        avatar: s3Resource ?? null,
      },
    })),
    TE.tap(({ id }) => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  update = ({ id, avatar, ...value }: InternalUpdateUserInputT) => pipe(
    TE.Do,
    TE.bind('originalRecord', () => this.get(id)),
    TE.bindW('s3Resource', ({ originalRecord }) => {
      if (!avatar || originalRecord.role === 'root') {
        return TE.of(null);
      }

      if ('id' in avatar) {
        return TE.of(avatar);
      }

      return pipe(
        this.organizationsS3BucketsRepo.getDefaultS3Bucket({
          organizationId: originalRecord.organization.id,
        }),
        TE.chainW(s3Bucket => this.s3Service.uploadFile({
          bucketId: s3Bucket.id,
          buffer: avatar.buffer,
          mimeType: avatar.mimeType,
          fileName: avatar.fileName,
        })),
      );
    }),
    TE.bindW('record', ({ s3Resource }) => pipe(
      this.repo.update({
        id,
        value: {
          ...value,
          avatar: s3Resource ?? null,
        },
      }),
    )),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
    TE.tap(({ s3Resource, originalRecord }) => {
      // Do it at the end, just in case. Make sure that permissions are updated before deleting the file.
      // The deletion of the file might fail. In that case, we don't want to lose the permissions.
      if (originalRecord.avatar?.id && s3Resource?.id !== originalRecord.avatar.id) {
        return this.s3Service.deleteFile({
          resourceId: originalRecord.avatar.id,
        });
      }

      return TE.of(undefined);
    }),
    TE.map(({ record }) => record),
  );

  createIfNotExists = (
    value: DistributiveOverwrite<SdkCreateUserInputT, {
      avatar?: TableRowWithId | null;
    }>,
  ) => pipe(
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

export type InternalCreateUserInputT = DistributiveOverwrite<SdkCreateUserInputT, {
  avatar: TableRowWithId | ExtractedFile | null;
}>;

export type InternalUpdateUserInputT = DistributiveOverwrite<SdkUpdateUserInputT & TableRowWithId, {
  avatar: TableRowWithId | ExtractedFile | null;
}>;
