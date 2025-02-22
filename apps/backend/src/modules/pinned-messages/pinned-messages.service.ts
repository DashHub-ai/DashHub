import { taskEither as TE } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type { SdkJwtTokenT } from '@llm/sdk';

import type { WithAuthFirewall } from '../auth';
import type { TableRowWithId } from '../database';

import { MessagesService } from '../messages';
import { PermissionsService } from '../permissions';
import { PinnedMessagesEsIndexRepo, PinnedMessagesEsSearchRepo } from './elasticsearch';
import { PinnedMessagesFirewall } from './pinned-messages.firewall';
import { PinnedMessagesRepo } from './pinned-messages.repo';

@injectable()
export class PinnedMessagesService implements WithAuthFirewall<PinnedMessagesFirewall> {
  constructor(
    @inject(PinnedMessagesRepo) private readonly repo: PinnedMessagesRepo,
    @inject(PinnedMessagesEsSearchRepo) private readonly searchRepo: PinnedMessagesEsSearchRepo,
    @inject(PinnedMessagesEsIndexRepo) private readonly esIndexRepo: PinnedMessagesEsIndexRepo,
    @inject(PermissionsService) private readonly permissionsService: PermissionsService,
    @inject(MessagesService) private readonly messagesService: MessagesService,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new PinnedMessagesFirewall(jwt, this, this.messagesService, this.permissionsService);

  get = this.searchRepo.get;

  search = this.searchRepo.search;

  findWithRelationsByIds = this.repo.findWithRelationsByIds;

  findAll = this.repo.findAll;

  create = flow(
    this.repo.create,
    TE.tap(({ id }) => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  delete = ({ id }: TableRowWithId) => pipe(
    this.repo.delete({ id }),
    TE.tap(() => this.esIndexRepo.deleteDocument(id)),
  );
}
