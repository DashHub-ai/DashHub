import { taskEither as TE } from 'fp-ts';
import { inject, injectable } from 'tsyringe';

import type { SdkCreateMessageInputT, SdkJwtTokenT } from '@llm/sdk';

import type { TableUuid } from '../database';

import { WithAuthFirewall } from '../auth';
import { MessagesFirewall } from './messages.firewall';
import { MessagesRepo } from './messages.repo';

@injectable()
export class MessagesService implements WithAuthFirewall<MessagesFirewall> {
  constructor(
    @inject(MessagesRepo) private readonly repo: MessagesRepo,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new MessagesFirewall(jwt, this);

  createMessage = (
    {
      chatId,
      message,
    }: {
      chatId: TableUuid;
      message: SdkCreateMessageInputT;
    },
  ) => {
    // eslint-disable-next-line no-console
    console.info({
      chatId,
      message,
    });

    return TE.of({
      id: 'sdasad',
    });
  };
}
