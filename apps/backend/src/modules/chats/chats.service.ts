import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type { RequiredBy } from '@llm/commons';

import { SdkCreateChatInputT, SdkJwtTokenT, SdkTableRowIdT } from '@llm/sdk';

import { WithAuthFirewall } from '../auth';
import { ChatsFirewall } from './chats.firewall';
import { ChatsRepo } from './chats.repo';

@injectable()
export class ChatsService implements WithAuthFirewall<ChatsFirewall> {
  constructor(
    @inject(ChatsRepo) private readonly repo: ChatsRepo,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new ChatsFirewall(jwt, this);

  unarchive = (id: SdkTableRowIdT) => this.repo.unarchive({ id });

  archive = (id: SdkTableRowIdT) => this.repo.archive({ id });

  create = (
    {
      organization,
      creator,
      ...values
    }: RequiredBy<SdkCreateChatInputT, 'organization' | 'creator'>,
  ) => pipe(
    this.repo.create({
      value: {
        ...values,
        organizationId: organization.id,
        creatorUserId: creator.id,
      },
    }),
  );
}
