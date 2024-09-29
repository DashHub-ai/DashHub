import { taskEither as TE } from 'fp-ts';
import { flow } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type { SdkJwtTokenT } from '@llm/sdk';

import type { WithAuthFirewall } from '../auth';

import { UsersEsSearchRepo } from './elasticsearch';
import { UsersEsIndexRepo } from './elasticsearch/users-es-index.repo';
import { UsersFirewall } from './users.firewall';
import { UsersRepo } from './users.repo';

@injectable()
export class UsersService implements WithAuthFirewall<UsersFirewall> {
  constructor(
    @inject(UsersRepo) private readonly usersRepo: UsersRepo,
    @inject(UsersEsIndexRepo) private readonly esIndexRepo: UsersEsIndexRepo,
    @inject(UsersEsSearchRepo) private readonly esSearchRepo: UsersEsSearchRepo,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new UsersFirewall(jwt, this);

  search = this.esSearchRepo.search;

  create = flow(
    this.usersRepo.create,
    TE.tap(({ id }) => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  createIfNotExists = flow(
    this.usersRepo.createIfNotExists,
    TE.tap(({ id, created }) =>
      created
        ? this.esIndexRepo.findAndIndexDocumentById(id)
        : TE.right(undefined),
    ),
  );
}
