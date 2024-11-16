import { flow } from 'fp-ts/lib/function';

import type { SdkJwtTokenT } from '@llm/sdk';

import { AuthFirewallService } from '~/modules/auth/firewall';

import type { AIModelsService } from './ai-models.service';

export class AIModelsFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly aiModelsService: AIModelsService,
  ) {
    super(jwt);
  }

  unarchive = flow(
    this.aiModelsService.unarchive,
    this.tryTEIfUser.is.root,
  );

  archive = flow(
    this.aiModelsService.archive,
    this.tryTEIfUser.is.root,
  );

  update = flow(
    this.aiModelsService.update,
    this.tryTEIfUser.is.root,
  );

  create = flow(
    this.aiModelsService.create,
    this.tryTEIfUser.is.root,
  );

  search = flow(
    this.aiModelsService.search,
    this.tryTEIfUser.is.root,
  );

  getDefault = flow(
    this.aiModelsService.getDefault,
    this.tryTEIfUser.is.root,
  );
}
