import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkCreateS3BucketInputT,
  SdkJwtTokenT,
  SdkTableRowIdT,
  SdkUpdateS3BucketInputT,
} from '@dashhub/sdk';
import type { WithAuthFirewall } from '~/modules/auth';
import type { TableId, TableRowWithId } from '~/modules/database';

import {
  asyncIteratorToVoidPromise,
  runTaskAsVoid,
  tapAsyncIterator,
  tryOrThrowTE,
} from '@dashhub/commons';

import { OrganizationsS3BucketsEsIndexRepo, OrganizationsS3BucketsEsSearchRepo } from './elasticsearch';
import { OrganizationsS3BucketsFirewall } from './organizations-s3-buckets.firewall';
import { OrganizationsS3BucketsRepo } from './organizations-s3-buckets.repo';

@injectable()
export class OrganizationsS3BucketsService implements WithAuthFirewall<OrganizationsS3BucketsFirewall> {
  constructor(
    @inject(OrganizationsS3BucketsRepo) private readonly repo: OrganizationsS3BucketsRepo,
    @inject(OrganizationsS3BucketsEsSearchRepo) private readonly esSearchRepo: OrganizationsS3BucketsEsSearchRepo,
    @inject(OrganizationsS3BucketsEsIndexRepo) private readonly esIndexRepo: OrganizationsS3BucketsEsIndexRepo,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new OrganizationsS3BucketsFirewall(jwt, this);

  unarchive = (id: SdkTableRowIdT) => pipe(
    this.repo.unarchive({ id }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  search = this.esSearchRepo.search;

  getDefaultS3Bucket = this.repo.getDefaultS3Bucket;

  create = (value: SdkCreateS3BucketInputT) => pipe(
    this.repo.create({
      value,
    }),
    TE.tap(() => this.esIndexRepo.reindexAllOrganizationS3Buckets(value.organization.id)),
  );

  update = ({ id, ...value }: SdkUpdateS3BucketInputT & TableRowWithId) => pipe(
    this.repo.update({ id, value }),
    TE.tap(({ organization }) => this.esIndexRepo.reindexAllOrganizationS3Buckets(organization.id)),
  );

  archive = (id: SdkTableRowIdT) => pipe(
    this.repo.archive({ id }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  archiveSeqByOrganizationId = (organizationId: SdkTableRowIdT) => TE.fromTask(
    pipe(
      this.repo.createIdsIterator({
        organizationId,
        chunkSize: 100,
      }),
      this.archiveSeqStream,
    ),
  );

  // Private as there is no verification if ids are associated with the organizations.
  private archiveSeqStream = (stream: AsyncIterableIterator<TableId[]>) => async () =>
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
}
