import { taskEither as TE } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';

import type {
  SdkCreateProjectInputT,
  SdkJwtTokenT,
  SdkUpdateProjectInputT,
} from '@llm/sdk';

import { AuthFirewallService } from '~/modules/auth/firewall';

import type { TableId, TableRowWithId } from '../database';
import type { PermissionsService } from '../permissions';
import type { EsProjectsInternalFilters } from './elasticsearch';
import type { ProjectsService } from './projects.service';

export class ProjectsFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly projectsService: ProjectsService,
    private readonly permissionsService: PermissionsService,
  ) {
    super(jwt);
  }

  get = flow(
    this.projectsService.get,
    this.permissionsService.asUser(this.jwt).chainValidateResultOrRaiseUnauthorized,
    TE.chainW(this.permissionsService.asUser(this.jwt).dropSdkPermissionsKeyIfNotCreator),
  );

  unarchive = (id: TableId) => pipe(
    this.permissionsService.asUser(this.jwt).findRecordAndCheckIfCreator({
      findRecord: this.projectsService.get(id),
    }),
    TE.chainW(() => this.projectsService.unarchive(id)),
  );

  archive = (id: TableId) => pipe(
    this.permissionsService.asUser(this.jwt).findRecordAndCheckIfCreator({
      findRecord: this.projectsService.get(id),
    }),
    TE.chainW(() => this.projectsService.archive(id)),
  );

  update = (attrs: SdkUpdateProjectInputT & TableRowWithId) => pipe(
    this.permissionsService.asUser(this.jwt).findRecordAndCheckPermissions({
      accessLevel: 'write',
      findRecord: this.projectsService.get(attrs.id),
    }),
    TE.chainW(() => this.projectsService.update(attrs)),
  );

  create = (dto: SdkCreateProjectInputT) => pipe(
    this.permissionsService.asUser(this.jwt).enforceOrganizationCreatorScope(dto),
    TE.fromEither,
    TE.chainW(this.projectsService.create),
  );

  search = (filters: EsProjectsInternalFilters) => pipe(
    filters,
    this.permissionsService.asUser(this.jwt).enforcePermissionsFilters,
    TE.chainEitherKW(this.permissionsService.asUser(this.jwt).enforceOrganizationScopeFilters),
    TE.chainW(this.projectsService.search),
    TE.chainW(this.permissionsService.asUser(this.jwt).dropSdkPaginationPermissionsKeysIfNotCreator),
  );
}
