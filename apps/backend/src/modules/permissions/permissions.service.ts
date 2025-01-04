import { inject, injectable } from 'tsyringe';

import { PermissionsEsSearchRepo } from './elasticsearch';

@injectable()
export class PermissionsService {
  constructor(
    @inject(PermissionsEsSearchRepo) private readonly esSearchRepo: PermissionsEsSearchRepo,
  ) {}

  getByResourceId = this.esSearchRepo.getByResourceId;
}
