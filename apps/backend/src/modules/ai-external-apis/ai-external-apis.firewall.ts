import { taskEither as TE } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';

import type { SdkJwtTokenT, SdkSearchAIExternalAPIsInputT, SdkTableRowIdT } from '@dashhub/sdk';

import { AuthFirewallService } from '~/modules/auth/firewall';

import type { TableId } from '../database';
import type { PermissionsService } from '../permissions';
import type {
  AIExternalAPIsService,
  InternalCreateExternalAPIInputT,
  InternalUpdateExternalAPIInputT,
} from './ai-external-apis.service';

export class AIExternalAPIsFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly apisService: AIExternalAPIsService,
    private readonly permissionsService: PermissionsService,
  ) {
    super(jwt);
  }

  get = flow(
    this.apisService.get,
    this.permissionsService.asUser(this.jwt).chainValidateResultOrRaiseUnauthorized,
    TE.chainW(this.permissionsService.asUser(this.jwt).dropSdkPermissionsKeyIfNotCreator),
  );

  search = (filters: SdkSearchAIExternalAPIsInputT) => pipe(
    filters,
    this.permissionsService.asUser(this.jwt).enforcePermissionsFilters,
    TE.chainEitherKW(this.permissionsService.asUser(this.jwt).enforceOrganizationScopeFilters),
    TE.chainW(this.apisService.search),
    TE.chainW(this.permissionsService.asUser(this.jwt).dropSdkPaginationPermissionsKeysIfNotCreator),
  );

  unarchive = (id: TableId) => pipe(
    this.permissionsService.asUser(this.jwt).findRecordAndCheckPermissions({
      accessLevel: 'write',
      findRecord: this.apisService.get(id),
    }),
    TE.chainW(() => this.apisService.unarchive(id)),
  );

  archive = (id: TableId) => pipe(
    this.permissionsService.asUser(this.jwt).findRecordAndCheckPermissions({
      accessLevel: 'write',
      findRecord: this.apisService.get(id),
    }),
    TE.chainW(() => this.apisService.archive(id)),
  );

  update = (attrs: InternalUpdateExternalAPIInputT) => pipe(
    this.permissionsService.asUser(this.jwt).findRecordAndCheckPermissions({
      accessLevel: 'write',
      findRecord: this.apisService.get(attrs.id),
    }),
    TE.chainW(() => this.apisService.update(attrs)),
  );

  create = (dto: Omit<InternalCreateExternalAPIInputT, 'creator'>) => pipe(
    this.permissionsService.asUser(this.jwt).enforceOrganizationScope(dto),
    TE.fromEither,
    TE.chainW(this.apisService.create),
    this.tryTEIfUser.oneOfOrganizationRole('owner', 'tech'),
  );

  getAIAsyncFunctions = (organizationId: SdkTableRowIdT) => {
    const asUser = this.permissionsService.asUser(this.jwt);

    return pipe(
      asUser.enforcePermissionsFilters({}),
      TE.bindW('organizationId', () => pipe(
        asUser.enforceMatchingOrganizationId(organizationId),
        TE.fromEither,
      )),
      TE.chainW(this.apisService.getCachedAIAsyncFunctionsForPermissions),
    );
  };
}
