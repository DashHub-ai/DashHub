import { flow } from 'fp-ts/lib/function';

import type { SdkJwtTokenT } from '@llm/sdk';

import { AuthFirewallService } from '~/modules/auth/firewall';

import type { PermissionsService } from './permissions.service';

export class PermissionsFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly permissionsService: PermissionsService,
  ) {
    super(jwt);
  }

  // TODO: Add belongs checks
  getByResource = flow(
    this.permissionsService.getByResource,
    this.tryTEIfUser.is.root,
  );

  // TODO: Add belongs checks
  upsert = flow(
    this.permissionsService.upsert,
    this.tryTEIfUser.is.root,
  );
}
