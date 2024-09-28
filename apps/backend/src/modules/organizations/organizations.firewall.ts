import { flow } from 'fp-ts/function';

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
