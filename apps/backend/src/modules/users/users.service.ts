import { taskEither as TE } from 'fp-ts';
import { flow } from 'fp-ts/function';
import { inject, injectable } from 'tsyringe';

import type { SdkJwtTokenT } from '@llm/sdk';

import type { WithAuthFirewall } from '../auth';

import { UsersEsIndexRepo } from './elasticsearch/users-es-index.repo';
import { UsersFirewall } from './users.firewall';
import { UsersRepo } from './users.repo';

@injectable()
export class UsersService implements WithAuthFirewall<UsersFirewall> {
  constructor(
    @inject(UsersRepo) private readonly usersRepo: UsersRepo,
    @inject(UsersEsIndexRepo) private readonly usersEsIndexRepo: UsersEsIndexRepo,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new UsersFirewall(jwt, this);

  create = flow(
    this.usersRepo.create,
    TE.tap(({ id }) => this.usersEsIndexRepo.findAndIndexDocumentById(id)),
  );

  createIfNotExists = flow(
    this.usersRepo.createIfNotExists,
    TE.tap(({ id, created }) =>
      created
        ? this.usersEsIndexRepo.findAndIndexDocumentById(id)
        : TE.right(undefined),
    ),
  );
}
