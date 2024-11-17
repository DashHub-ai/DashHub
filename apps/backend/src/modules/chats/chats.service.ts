import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type { RequiredBy } from '@llm/commons';

import { SdkCreateChatInputT, SdkJwtTokenT, SdkTableRowIdT } from '@llm/sdk';

import { WithAuthFirewall } from '../auth';
import { ChatsFirewall } from './chats.firewall';
import { ChatsEsIndexRepo, ChatsEsSearchRepo } from './elasticsearch';
import { ChatsRepo } from './repo/chats.repo';

@injectable()
export class ChatsService implements WithAuthFirewall<ChatsFirewall> {
  constructor(
    @inject(ChatsRepo) private readonly repo: ChatsRepo,
    @inject(ChatsEsSearchRepo) private readonly esSearchRepo: ChatsEsSearchRepo,
    @inject(ChatsEsIndexRepo) private readonly esIndexRepo: ChatsEsIndexRepo,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new ChatsFirewall(jwt, this);

  search = this.esSearchRepo.search;

  unarchive = (id: SdkTableRowIdT) => this.repo.unarchive({ id });

  archive = (id: SdkTableRowIdT) => this.repo.archive({ id });

  create = (value: RequiredBy<SdkCreateChatInputT, 'organization' | 'creator'>) => pipe(
    this.repo.create({
      value,
    }),
    TE.tap(({ id }) => this.esIndexRepo.findAndIndexDocumentById(id)),
  );
}
