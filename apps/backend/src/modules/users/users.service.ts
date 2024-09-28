import { taskEither as TE } from 'fp-ts';
import { flow } from 'fp-ts/function';
import { inject, injectable } from 'tsyringe';

import { UsersEsIndexRepo } from './elasticsearch/users-es-index.repo';
import { UsersRepo } from './users.repo';

@injectable()
export class UsersService {
  constructor(
    @inject(UsersRepo) private readonly usersRepo: UsersRepo,
    @inject(UsersEsIndexRepo) private readonly usersEsIndexRepo: UsersEsIndexRepo,
  ) {}

  createIfNotExists = flow(
    this.usersRepo.createIfNotExists,
    TE.tap(({ id, created }) =>
      created
        ? this.usersEsIndexRepo.findAndIndexDocumentById(id)
        : TE.right(undefined),
    ),
  );
}
