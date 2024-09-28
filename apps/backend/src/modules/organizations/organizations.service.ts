import { inject, injectable } from 'tsyringe';

import { OrganizationsEsSearchRepo } from './elasticsearch/organizations-es-search.repo';

@injectable()
export class OrganizationsService {
  constructor(
    @inject(OrganizationsEsSearchRepo) private readonly searchRepo: OrganizationsEsSearchRepo,
  ) {}

  search = this.searchRepo.search;
}
