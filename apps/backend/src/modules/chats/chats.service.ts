import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type { RequiredBy } from '@llm/commons';

import {
  SdkCreateChatInputT,
  SdkJwtTokenT,
  SdkTableRowUuidT,
  SdkUpdateChatInputT,
} from '@llm/sdk';

import { WithAuthFirewall } from '../auth';
import { TableId, TableRowWithUuid, TableUuid } from '../database';
import { ChatsFirewall } from './chats.firewall';
import { ChatsRepo } from './chats.repo';
import { ChatsEsIndexRepo, ChatsEsSearchRepo } from './elasticsearch';

@injectable()
export class ChatsService implements WithAuthFirewall<ChatsFirewall> {
  constructor(
    @inject(ChatsRepo) private readonly repo: ChatsRepo,
    @inject(ChatsEsSearchRepo) private readonly esSearchRepo: ChatsEsSearchRepo,
    @inject(ChatsEsIndexRepo) private readonly esIndexRepo: ChatsEsIndexRepo,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new ChatsFirewall(jwt, this);

  get = this.esSearchRepo.get;

  search = this.esSearchRepo.search;

  unarchive = (id: SdkTableRowUuidT) => pipe(
    this.repo.unarchive({ id }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  archive = (id: SdkTableRowUuidT) => pipe(
    this.repo.archive({ id }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  create = (value: RequiredBy<SdkCreateChatInputT, 'organization' | 'creator'>) => pipe(
    this.repo.create({ value }),
    TE.tap(({ id }) => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  update = ({ id, ...value }: SdkUpdateChatInputT & TableRowWithUuid) => pipe(
    this.repo.update({ id, value }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  assignToProject = (id: TableUuid, projectId: TableId) => pipe(
    this.repo.assignToProject({ id, projectId }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );
}
