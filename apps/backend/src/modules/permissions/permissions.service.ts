import { inject, injectable } from 'tsyringe';

import { PermissionsRepo } from './permissions.repo';

@injectable()
export class PermissionsService {
  constructor(
    @inject(PermissionsRepo) private readonly repo: PermissionsRepo,
  ) {}

  upsert = this.repo.upsert;
}
