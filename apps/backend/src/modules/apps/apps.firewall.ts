import { flow } from 'fp-ts/lib/function';

import type { SdkJwtTokenT } from '@llm/sdk';

import { AuthFirewallService } from '~/modules/auth/firewall';

import type { AppsService } from './apps.service';

export class AppsFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly appsService: AppsService,
  ) {
    super(jwt);
  }

  unarchive = flow(
    this.appsService.unarchive,
    this.tryTEIfUser.is.root,
  );

  archive = flow(
    this.appsService.archive,
    this.tryTEIfUser.is.root,
  );

  update = flow(
    this.appsService.update,
    this.tryTEIfUser.is.root,
  );

  create = flow(
    this.appsService.create,
    this.tryTEIfUser.is.root,
  );

  search = flow(
    this.appsService.search,
    this.tryTEIfUser.is.root,
  );

  get = flow(
    this.appsService.get,
    this.tryTEIfUser.is.root,
  );

  summarizeChatToApp = flow(
    this.appsService.summarizeChatToApp,
    this.tryTEIfUser.is.root,
  );
}
