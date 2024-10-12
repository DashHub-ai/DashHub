import { flow } from 'fp-ts/lib/function';

import type { SdkJwtTokenT } from '@llm/sdk';

import { AuthFirewallService } from '~/modules/auth/firewall';

import type { OrganizationsS3BucketsService } from './organizations-s3-buckets.service';

export class OrganizationsS3BucketsFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly orgsS3BucketsService: OrganizationsS3BucketsService,
  ) {
    super(jwt);
  }

  unarchive = flow(
    this.orgsS3BucketsService.unarchive,
    this.tryTEIfUser.is.root,
  );

  archive = flow(
    this.orgsS3BucketsService.archive,
    this.tryTEIfUser.is.root,
  );

  update = flow(
    this.orgsS3BucketsService.update,
    this.tryTEIfUser.is.root,
  );

  create = flow(
    this.orgsS3BucketsService.create,
    this.tryTEIfUser.is.root,
  );

  search = flow(
    this.orgsS3BucketsService.search,
    this.tryTEIfUser.is.root,
  );
}
