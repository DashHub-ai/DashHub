import { inject, injectable } from 'tsyringe';

import type { SdkJwtTokenT } from '@llm/sdk';

import type { WithAuthFirewall } from '../auth';

import { PinnedMessagesFirewall } from './pinned-messages.firewall';
import { PinnedMessagesRepo } from './pinned-messages.repo';

@injectable()
export class PinnedMessagesService implements WithAuthFirewall<PinnedMessagesFirewall> {
  constructor(
    @inject(PinnedMessagesRepo) private readonly pinnedMessagesRepo: PinnedMessagesRepo,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new PinnedMessagesFirewall(jwt, this);

  findWithRelationsByIds = this.pinnedMessagesRepo.findWithRelationsByIds;
}
