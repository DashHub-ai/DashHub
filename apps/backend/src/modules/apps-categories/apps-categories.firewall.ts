import { flow } from 'fp-ts/lib/function';

import type { SdkJwtTokenT } from '@llm/sdk';

import { AuthFirewallService } from '~/modules/auth/firewall';

import type { AppsCategoriesService } from './apps-categories.service';

export class AppsCategoriesFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly appsCategoriesService: AppsCategoriesService,
  ) {
    super(jwt);
  }

  unarchive = flow(
    this.appsCategoriesService.unarchive,
    this.tryTEIfUser.is.root,
  );

  archive = flow(
    this.appsCategoriesService.archive,
    this.tryTEIfUser.is.root,
  );

  update = flow(
    this.appsCategoriesService.update,
    this.tryTEIfUser.is.root,
  );

  create = flow(
    this.appsCategoriesService.create,
    this.tryTEIfUser.is.root,
  );

  search = flow(
    this.appsCategoriesService.search,
    this.tryTEIfUser.is.root,
  );

  get = flow(
    this.appsCategoriesService.get,
    this.tryTEIfUser.is.root,
  );
}
