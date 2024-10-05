import { flow } from 'fp-ts/lib/function';

import type { SdkJwtTokenT } from '@llm/sdk';

import { AuthFirewallService } from '~/modules/auth/firewall';

import type { OrganizationsService } from './organizations.service';

export class OrganizationsFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly organizationsService: OrganizationsService,
  ) {
    super(jwt);
  }

  archive = flow(
    this.organizationsService.archive,
    this.tryTEIfUser.is.root,
  );

  update = flow(
    this.organizationsService.update,
    this.tryTEIfUser.is.root,
  );

  create = flow(
    this.organizationsService.create,
    this.tryTEIfUser.is.root,
  );

  search = flow(
    this.organizationsService.search,
    this.tryTEIfUser.is.root,
  );
}
