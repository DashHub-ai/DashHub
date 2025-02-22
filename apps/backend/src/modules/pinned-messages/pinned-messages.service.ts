import { inject, injectable } from 'tsyringe';

import type { SdkJwtTokenT } from '@llm/sdk';

import type { WithAuthFirewall } from '../auth';

import { PermissionsService } from '../permissions';
import { PinnedMessagesEsSearchRepo } from './elasticsearch';
import { PinnedMessagesFirewall } from './pinned-messages.firewall';
import { PinnedMessagesRepo } from './pinned-messages.repo';

@injectable()
export class PinnedMessagesService implements WithAuthFirewall<PinnedMessagesFirewall> {
  constructor(
    @inject(PinnedMessagesRepo) private readonly pinnedMessagesRepo: PinnedMessagesRepo,
    @inject(PinnedMessagesEsSearchRepo) private readonly pinnedMessagesEsSearchRepo: PinnedMessagesEsSearchRepo,
    @inject(PermissionsService) private readonly permissionsService: PermissionsService,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new PinnedMessagesFirewall(jwt, this, this.permissionsService);

  search = this.pinnedMessagesEsSearchRepo.search;

  findWithRelationsByIds = this.pinnedMessagesRepo.findWithRelationsByIds;
}
