import { inject, injectable } from 'tsyringe';

import { UsersRepo } from './users.repo';

@injectable()
export class UsersService {
  constructor(
    @inject(UsersRepo) private readonly usersRepo: UsersRepo,
  ) {}

  create = this.usersRepo.create;

  createIfNotExists = this.usersRepo.createIfNotExists;
}
