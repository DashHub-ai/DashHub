import { taskEither as TE } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';

import type { SdkJwtTokenT, SdkSearchAIExternalAPIsInputT } from '@llm/sdk';

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
  );

  search = (filters: SdkSearchAIExternalAPIsInputT) => pipe(
    filters,
    this.permissionsService.asUser(this.jwt).enforcePermissionsFilters,
    TE.chainEitherKW(this.permissionsService.asUser(this.jwt).enforceOrganizationScopeFilters),
    TE.chainW(this.apisService.search),
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
    this.permissionsService.asUser(this.jwt).enforceOrganizationCreatorScope(dto),
    TE.fromEither,
    TE.chainW(this.apisService.create),
    this.tryTEIfUser.oneOfOrganizationRole('owner', 'tech'),
  );
}
