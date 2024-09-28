import { flow } from 'fp-ts/function';

import type { JWTTokenT } from '@llm/sdk';

import { AuthFirewallService } from '~/modules/auth/firewall';

import type { OrganizationsService } from './organizations.service';

export class OrganizationsFirewall extends AuthFirewallService {
  constructor(
    jwt: JWTTokenT,
    private readonly organizationsService: OrganizationsService,
  ) {
    super(jwt);
  }

  search = flow(
    this.organizationsService.search,
    this.tryTEIfUser.is.root,
  );
}
