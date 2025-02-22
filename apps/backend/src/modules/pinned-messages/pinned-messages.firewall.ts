import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import type { PartialBy } from '@llm/commons';
import type { SdkJwtTokenT, SdkSearchPinnedMessagesInputT } from '@llm/sdk';

import type { TableId } from '../database';
import type { MessagesService } from '../messages';
import type { PermissionsService } from '../permissions';
import type { InternalCreatePinnedMessageInputT, PinnedMessagesService } from './pinned-messages.service';

import { AuthFirewallService } from '../auth';

export class PinnedMessagesFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly pinnedMessagesService: PinnedMessagesService,
    private readonly messagesService: MessagesService,
    private readonly permissionsService: PermissionsService,
  ) {
    super(jwt);
  }

  search = (dto: SdkSearchPinnedMessagesInputT) => pipe(
    this.permissionsService.asUser(this.jwt).enforceCreatorScopeFilters(dto),
    TE.fromEither,
    TE.chainW(this.pinnedMessagesService.search),
  );

  create = (dto: PartialBy<InternalCreatePinnedMessageInputT, 'creator'>) => pipe(
    this.permissionsService.asUser(this.jwt).findRecordAndCheckIfCreator({
      findRecord: pipe(
        this.messagesService.get(dto.messageId),
        TE.map(({ chat }) => chat),
      ),
    }),
    TE.chainEitherKW(() => this.permissionsService.asUser(this.jwt).enforceCreatorScope(dto)),
    TE.chainW(this.pinnedMessagesService.create),
  );

  delete = (id: TableId) => pipe(
    this.permissionsService.asUser(this.jwt).findRecordAndCheckIfCreator({
      findRecord: this.pinnedMessagesService.get(id),
    }),
    TE.chainW(() => this.pinnedMessagesService.delete({ id })),
  );
}
