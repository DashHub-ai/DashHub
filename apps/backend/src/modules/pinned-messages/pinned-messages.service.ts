import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type { Overwrite } from '@llm/commons';
import type { SdkJwtTokenT, SdkPinMessageInputT } from '@llm/sdk';

import type { WithAuthFirewall } from '../auth';
import type { TableRowWithId } from '../database';

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
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new PinnedMessagesFirewall(jwt, this, this.permissionsService);

  get = this.searchRepo.get;

  search = this.searchRepo.search;

  findWithRelationsByIds = this.repo.findWithRelationsByIds;

  create = (dto: InternalCreatePinnedMessageInputT) => pipe(
    this.repo.create({
      value: {
        creatorUserId: dto.creator.id,
        messageId: dto.messageId,
      },
    }),
    TE.tap(({ id }) => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  delete = ({ id }: TableRowWithId) => pipe(
    this.repo.delete({ id }),
    TE.tap(() => this.esIndexRepo.deleteDocument(id)),
  );
}

export type InternalCreatePinnedMessageInputT = Overwrite<SdkPinMessageInputT, {
  creator: TableRowWithId;
}>;
