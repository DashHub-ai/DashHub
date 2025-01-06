import { flow, pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';

import type {
  SdkJwtTokenT,
  SdkRequestAIReplyInputT,
  SdkSearchMessageItemT,
  SdkSearchMessagesInputT,
} from '@llm/sdk';

import type { ChatsService } from '../chats';
import type { TableRowWithUuid, TableUuid } from '../database';
import type { PermissionsService } from '../permissions';
import type { AttachAppInputT, CreateUserMessageInputT, MessagesService } from './messages.service';

import { AuthFirewallService } from '../auth';

export class MessagesFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly messagesService: MessagesService,
    private readonly chatsService: Readonly<ChatsService>,
    private readonly permissionsService: Readonly<PermissionsService>,
  ) {
    super(jwt);
  }

  // TODO: Add belongs checks
  search = flow(
    this.messagesService.search,
    this.tryTEIfUser.is.root,
    TE.map(({ items, ...attrs }) => ({
      ...attrs,
      items: MessagesFirewall.hideSystemMessages(items),
    })),
  );

  searchByChatId = (
    chatId: TableUuid,
    dto: Omit<SdkSearchMessagesInputT, 'chatIds'>,
  ) => pipe(
    this.permissionsService.asUser(this.jwt).findRecordAndCheckPermissions({
      accessLevel: 'read',
      findRecord: this.chatsService.get(chatId),
    }),
    TE.chainW(() => this.messagesService.searchByChatId(chatId, dto)),
  );

  aiReply = (
    attrs: TableRowWithUuid & SdkRequestAIReplyInputT,
    signal?: AbortSignal,
  ) => pipe(
    this.permissionsService.asUser(this.jwt).findRecordAndCheckPermissions({
      accessLevel: 'write',
      findRecord: pipe(
        this.messagesService.get(attrs.id),
        TE.chain(message => this.chatsService.get(message.chat.id)),
      ),
    }),
    TE.chainW(() => this.messagesService.aiReply(attrs, signal)),
  );

  attachApp = (dto: Omit<AttachAppInputT, 'creator'>) =>
    pipe(
      this.permissionsService.asUser(this.jwt).findRecordAndCheckPermissions({
        accessLevel: 'write',
        findRecord: this.chatsService.get(dto.chat.id),
      }),
      TE.chainW(() => this.messagesService.attachApp({
        ...dto,
        creator: this.userIdRow,
      })),
    );

  create = (dto: Omit<CreateUserMessageInputT, 'creator'>) =>
    pipe(
      this.permissionsService.asUser(this.jwt).findRecordAndCheckPermissions({
        accessLevel: 'write',
        findRecord: this.chatsService.get(dto.chat.id),
      }),
      TE.chainW(() => this.messagesService.createUserMessage({
        ...dto,
        creator: this.userIdRow,
      })),
    );

  private static hideSystemMessages = (messages: Array<SdkSearchMessageItemT>) =>
    messages.map(message => ({
      ...message,
      ...message.role === 'system' && {
        content: 'System message',
      },
    }));
}
