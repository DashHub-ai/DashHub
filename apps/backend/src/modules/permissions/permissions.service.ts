import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkJwtTokenT,
  SdkPermissionResourceT,
  SdkUpsertResourcePermissionsInputT,
} from '@llm/sdk';

import type { WithAuthFirewall } from '../auth';

import { PermissionsEsIndexRepo, PermissionsEsSearchRepo } from './elasticsearch';
import { PermissionsFirewall } from './permissions.firewall';
import { PermissionsRepo } from './permissions.repo';

@injectable()
export class PermissionsService implements WithAuthFirewall<PermissionsFirewall> {
  constructor(
    @inject(PermissionsRepo) private readonly repo: PermissionsRepo,
    @inject(PermissionsEsIndexRepo) private readonly esIndexRepo: PermissionsEsIndexRepo,
    @inject(PermissionsEsSearchRepo) private readonly esSearchRepo: PermissionsEsSearchRepo,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new PermissionsFirewall(jwt, this);

  getByResource = this.esSearchRepo.getByResource;

  upsert = (
    value: {
      permissions: SdkUpsertResourcePermissionsInputT;
      resource: SdkPermissionResourceT;
    },
  ) => pipe(
    this.repo.upsert({ value }),
    TE.tap(() => this.esIndexRepo.reindexByResource(value.resource)),
  );
}
