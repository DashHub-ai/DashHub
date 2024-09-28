import { pipe } from 'fp-ts/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkCreateOrganizationInputT,
  SdkJwtTokenT,
  SdkUpdateOrganizationInputT,
} from '@llm/sdk';

import { tapTaskEitherTE } from '@llm/commons';

import type { WithAuthFirewall } from '../auth';
import type { TableRowWithId } from '../database';

import { OrganizationsEsIndexRepo } from './elasticsearch';
import { OrganizationsEsSearchRepo } from './elasticsearch/organizations-es-search.repo';
import { OrganizationsFirewall } from './organizations.firewall';
import { OrganizationsRepo } from './organizations.repo';

@injectable()
export class OrganizationsService implements WithAuthFirewall<OrganizationsFirewall> {
  constructor(
    @inject(OrganizationsRepo) private readonly repo: OrganizationsRepo,
    @inject(OrganizationsEsSearchRepo) private readonly esSearchRepo: OrganizationsEsSearchRepo,
    @inject(OrganizationsEsIndexRepo) private readonly esIndexRepo: OrganizationsEsIndexRepo,
  ) {}

  search = this.esSearchRepo.search;

  create = (value: SdkCreateOrganizationInputT) => pipe(
    this.repo.create({ value }),
    tapTaskEitherTE(({ id }) => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  update = ({ id, ...value }: SdkUpdateOrganizationInputT & TableRowWithId) => pipe(
    this.repo.update({ id, value }),
    tapTaskEitherTE(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  asUser = (jwt: SdkJwtTokenT) => new OrganizationsFirewall(jwt, this);
}
