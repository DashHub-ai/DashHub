import { taskEither as TE } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';

import {
  dropSdkPaginationPermissionsKeysIfNotCreator,
  dropSdkPermissionsKeyIfNotCreator,
  type SdkJwtTokenT,
  type SdkSearchProjectEmbeddingsInputT,
} from '@llm/sdk';
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
    TE.map(dropSdkPermissionsKeyIfNotCreator(this.jwt)),
  );

  search = (filters: SdkSearchProjectEmbeddingsInputT) => pipe(
    filters,
    this.permissionsService.asUser(this.jwt).enforcePermissionsFilters,
    TE.chainEitherKW(this.permissionsService.asUser(this.jwt).enforceOrganizationScopeFilters),
    TE.chainW(this.projectsEmbeddingsService.search),
    TE.map(dropSdkPaginationPermissionsKeysIfNotCreator(this.jwt)),
  );
}
