import { taskEither as TE } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';

import {
  mapSdkOffsetPaginationItems,
  SDK_CREDENTIALS_MASK,
  type SdkCreateSearchEngineInputT,
  type SdkJwtTokenT,
  type SdkSearchEngineT,
  type SdkSearchSearchEnginesInputT,
  type SdkUpdateSearchEngineInputT,
} from '@dashhub/sdk';
import { AuthFirewallService } from '~/modules/auth/firewall';

import type { TableId, TableRowWithId } from '../database';
import type { PermissionsService } from '../permissions';
import type { SearchEnginesService } from './search-engines.service';

export class SearchEnginesFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly aiModelsService: SearchEnginesService,
    private readonly permissionsService: Readonly<PermissionsService>,
  ) {
    super(jwt);
  }

  update = (attrs: SdkUpdateSearchEngineInputT & TableRowWithId) => pipe(
    this.permissionsService.asUser(this.jwt).findRecordAndCheckOrganizationMatch({
      findRecord: this.aiModelsService.get(attrs.id),
    }),
    TE.chainW(() => this.aiModelsService.update(attrs)),
    this.tryTEIfUser.oneOfOrganizationRole('owner', 'tech'),
  );

  create = (dto: SdkCreateSearchEngineInputT) => pipe(
    this.permissionsService.asUser(this.jwt).enforceOrganizationScope(dto),
    TE.fromEither,
    TE.chainW(this.aiModelsService.create),
    this.tryTEIfUser.oneOfOrganizationRole('owner', 'tech'),
  );

  unarchive = (id: TableId) => pipe(
    this.permissionsService.asUser(this.jwt).findRecordAndCheckOrganizationMatch({
      findRecord: this.aiModelsService.get(id),
    }),
    TE.chainW(() => this.aiModelsService.unarchive(id)),
    this.tryTEIfUser.oneOfOrganizationRole('owner', 'tech'),
  );

  archive = (id: TableId) => pipe(
    this.permissionsService.asUser(this.jwt).findRecordAndCheckOrganizationMatch({
      findRecord: this.aiModelsService.get(id),
    }),
    TE.chainW(() => this.aiModelsService.archive(id)),
    this.tryTEIfUser.oneOfOrganizationRole('owner', 'tech'),
  );

  search = (dto: SdkSearchSearchEnginesInputT) => pipe(
    this.permissionsService.asUser(this.jwt).enforceOrganizationScopeFilters(dto),
    TE.fromEither,
    TE.chainW(this.aiModelsService.search),
    TE.map(mapSdkOffsetPaginationItems(anonymizeSearchEngineCredentials)),
  );

  getDefault = flow(
    this.permissionsService.asUser(this.jwt).enforceMatchingOrganizationId,
    TE.fromEither,
    TE.chainW(this.aiModelsService.getDefault),
    TE.map(anonymizeSearchEngineCredentials),
  );
}

function anonymizeSearchEngineCredentials(aiModel: SdkSearchEngineT): SdkSearchEngineT {
  return {
    ...aiModel,
    credentials: {
      ...aiModel.credentials,
      apiKey: SDK_CREDENTIALS_MASK,
    },
  };
}
