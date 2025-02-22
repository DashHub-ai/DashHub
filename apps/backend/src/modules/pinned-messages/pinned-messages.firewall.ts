import type { SdkJwtTokenT } from '@llm/sdk';

import type { PinnedMessagesService } from './pinned-messages.service';

import { AuthFirewallService } from '../auth';

export class PinnedMessagesFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly pinnedMessagesService: PinnedMessagesService,
  ) {
    super(jwt);
  }
}
