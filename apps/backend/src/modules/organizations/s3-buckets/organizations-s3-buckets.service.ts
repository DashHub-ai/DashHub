import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkCreateS3BucketInputT,
  SdkJwtTokenT,
  SdkTableRowIdT,
  SdkUpdateS3BucketInputT,
} from '@llm/sdk';
import type { WithAuthFirewall } from '~/modules/auth';
import type { TableRowWithId } from '~/modules/database';

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

  archive = (id: SdkTableRowIdT) => pipe(
    this.repo.archive({ id }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  search = this.esSearchRepo.search;

  create = (value: SdkCreateS3BucketInputT) => pipe(
    this.repo.create({
      value,
    }),
    TE.tap(({ id }) => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  update = ({ id, ...value }: SdkUpdateS3BucketInputT & TableRowWithId) => pipe(
    this.repo.update({ id, value }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );
}
