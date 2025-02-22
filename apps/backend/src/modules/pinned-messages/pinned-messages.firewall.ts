import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import type { SdkJwtTokenT, SdkSearchPinnedMessagesInputT } from '@llm/sdk';

import type { PermissionsService } from '../permissions';
import type { PinnedMessagesService } from './pinned-messages.service';

import { AuthFirewallService } from '../auth';

export class PinnedMessagesFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly pinnedMessagesService: PinnedMessagesService,
    private readonly permissionsService: PermissionsService,
  ) {
    super(jwt);
  }

  search = (dto: SdkSearchPinnedMessagesInputT) => pipe(
    this.permissionsService.asUser(this.jwt).enforceCreatorScopeFilters(dto),
    TE.fromEither,
    TE.chainW(this.pinnedMessagesService.search),
  );
}
