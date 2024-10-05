import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkCreateOrganizationInputT,
  SdkJwtTokenT,
  SdkTableRowIdT,
  SdkUpdateOrganizationInputT,
} from '@llm/sdk';

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

  asUser = (jwt: SdkJwtTokenT) => new OrganizationsFirewall(jwt, this);

  archive = (id: SdkTableRowIdT) => pipe(
    this.repo.archive({ id }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  search = this.esSearchRepo.search;

  create = (value: SdkCreateOrganizationInputT) => pipe(
    this.repo.create({ value }),
    TE.tap(({ id }) => this.esIndexRepo.findAndIndexDocumentById(id)),
  );

  update = ({ id, ...value }: SdkUpdateOrganizationInputT & TableRowWithId) => pipe(
    this.repo.update({ id, value }),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );
}
