import { taskEither as TE } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';

import type {
  SdkJwtTokenT,
  SdkSearchProjectEmbeddingsInputT,
} from '@dashhub/sdk';

import { AuthFirewallService } from '~/modules/auth/firewall';

import type { PermissionsService } from '../permissions';
import type { ProjectsEmbeddingsService } from './projects-embeddings.service';

export class ProjectsEmbeddingsFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly projectsEmbeddingsService: ProjectsEmbeddingsService,
    private readonly permissionsService: Readonly<PermissionsService>,
  ) {
    super(jwt);
  }

  get = flow(
    this.projectsEmbeddingsService.get,
    this.permissionsService.asUser(this.jwt).chainValidateResultOrRaiseUnauthorized,
    TE.chainW(this.permissionsService.asUser(this.jwt).dropSdkPermissionsKeyIfNotCreator),
  );

  search = (filters: SdkSearchProjectEmbeddingsInputT) => pipe(
    filters,
    this.permissionsService.asUser(this.jwt).enforcePermissionsFilters,
    TE.chainEitherKW(this.permissionsService.asUser(this.jwt).enforceOrganizationScopeFilters),
    TE.chainW(this.projectsEmbeddingsService.search),
    TE.chainW(this.permissionsService.asUser(this.jwt).dropSdkPaginationPermissionsKeysIfNotCreator),
  );
}
