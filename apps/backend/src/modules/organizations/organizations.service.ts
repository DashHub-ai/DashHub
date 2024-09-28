import { inject, injectable } from 'tsyringe';

import type { JWTTokenT } from '@llm/sdk';

import type { WithAuthFirewall } from '../auth';

import { OrganizationsEsSearchRepo } from './elasticsearch/organizations-es-search.repo';
import { OrganizationsFirewall } from './organizations.firewall';

@injectable()
export class OrganizationsService implements WithAuthFirewall<OrganizationsFirewall> {
  constructor(
    @inject(OrganizationsEsSearchRepo) private readonly searchRepo: OrganizationsEsSearchRepo,
  ) {}

  search = this.searchRepo.search;

  asUser = (jwt: JWTTokenT) => new OrganizationsFirewall(jwt, this);
}
