import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkCreateAIExternalAPIInputT,
  SdkJwtTokenT,
  SdkTableRowIdT,
  SdkUpdateAIExternalAPIInputT,
} from '@llm/sdk';

import {
  asyncIteratorToVoidPromise,
  type Overwrite,
  runTaskAsVoid,
  tapAsyncIterator,
  tryOrThrowTE,
} from '@llm/commons';

import type { ExtractedFile } from '../api/helpers';
import type { WithAuthFirewall } from '../auth';
import type { TableId, TableRowWithId } from '../database';

import { OrganizationsS3BucketsRepo } from '../organizations/s3-buckets';
import { PermissionsService } from '../permissions';
import { S3Service } from '../s3';
import { AIExternalAPIsFirewall } from './ai-external-apis.firewall';
import { AIExternalAPIsRepo } from './ai-external-apis.repo';
import { AIExternalAPIsEsIndexRepo, AIExternalAPIsEsSearchRepo } from './elasticsearch';

@injectable()
export class AIExternalAPIsService implements WithAuthFirewall<AIExternalAPIsFirewall> {
  constructor(
    @inject(AIExternalAPIsRepo) private readonly repo: AIExternalAPIsRepo,
    @inject(AIExternalAPIsEsSearchRepo) private readonly esSearchRepo: AIExternalAPIsEsSearchRepo,
    @inject(AIExternalAPIsEsIndexRepo) private readonly esIndexRepo: AIExternalAPIsEsIndexRepo,
    @inject(PermissionsService) private readonly permissionsService: PermissionsService,
    @inject(S3Service) private readonly s3Service: S3Service,
    @inject(OrganizationsS3BucketsRepo) private readonly organizationsS3BucketsRepo: OrganizationsS3BucketsRepo,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new AIExternalAPIsFirewall(jwt, this, this.permissionsService);

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

  create = (
    {
      organization,
      logo,
      creator,
      ...values
    }: InternalCreateExternalAPIInputT,
  ) => pipe(
    TE.Do,
    TE.bind('s3Resource', () => {
      if (!logo) {
        return TE.of(null);
      }

      if ('id' in logo) {
        return TE.of(logo);
      }

      return pipe(
        this.organizationsS3BucketsRepo.getDefaultS3Bucket({
          organizationId: organization.id,
        }),
        TE.chainW(s3Bucket => this.s3Service.uploadFile({
          bucketId: s3Bucket.id,
          buffer: logo.buffer,
          mimeType: logo.mimeType,
          fileName: logo.fileName,
        })),
      );
    }),
    TE.chainW(({ s3Resource }) => this.repo.create({
      value: {
        ...values,
        organizationId: organization.id,
        logoS3ResourceId: s3Resource?.id,
      },
    })),
    TE.tap(({ id }) => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  update = ({ id, logo, ...value }: InternalUpdateExternalAPIInputT) => pipe(
    TE.Do,
    TE.bind('originalRecord', () => this.get(id)),
    TE.bindW('s3Resource', ({ originalRecord }) => {
      if (!logo) {
        return TE.of(null);
      }

      if ('id' in logo) {
        return TE.of(logo);
      }

      return pipe(
        this.organizationsS3BucketsRepo.getDefaultS3Bucket({
          organizationId: originalRecord.organization.id,
        }),
        TE.chainW(s3Bucket => this.s3Service.uploadFile({
          bucketId: s3Bucket.id,
          buffer: logo.buffer,
          mimeType: logo.mimeType,
          fileName: logo.fileName,
        })),
      );
    }),
    TE.bindW('record', ({ s3Resource }) => pipe(
      this.repo.update({
        id,
        value: {
          ...value,
          logoS3ResourceId: s3Resource?.id ?? null,
        },
      }),
    )),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
    TE.tap(({ s3Resource, originalRecord }) => {
      // Do it at the end, just in case. Make sure that permissions are updated before deleting the file.
      // The deletion of the file might fail. In that case, we don't want to lose the permissions.
      if (originalRecord.logo?.id && s3Resource?.id !== originalRecord.logo.id) {
        return this.s3Service.deleteFile({
          resourceId: originalRecord.logo.id,
        });
      }

      return TE.of(undefined);
    }),
    TE.map(({ record }) => record),
  );
}

export type InternalCreateExternalAPIInputT = Overwrite<SdkCreateAIExternalAPIInputT, {
  logo: TableRowWithId | ExtractedFile | null;
  creator: TableRowWithId;
}>;

export type InternalUpdateExternalAPIInputT = Overwrite<SdkUpdateAIExternalAPIInputT & TableRowWithId, {
  logo: TableRowWithId | ExtractedFile | null;
}>;
