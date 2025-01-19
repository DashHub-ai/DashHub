import { taskEither as TE } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';

import {
  mapSdkOffsetPaginationItems,
  type SdkAIModelT,
  type SdkCreateAIModelInputT,
  type SdkJwtTokenT,
  type SdkSearchAIModelsInputT,
  type SdkUpdateAIModelInputT,
} from '@llm/sdk';
import { AuthFirewallService } from '~/modules/auth/firewall';

import type { TableId, TableRowWithId } from '../database';
import type { PermissionsService } from '../permissions';
import type { AIModelsService } from './ai-models.service';

export class AIModelsFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly aiModelsService: AIModelsService,
    private readonly permissionsService: Readonly<PermissionsService>,
  ) {
    super(jwt);
  }

  update = (attrs: SdkUpdateAIModelInputT & TableRowWithId) => pipe(
    this.permissionsService.asUser(this.jwt).findRecordAndCheckOrganizationMatch({
      findRecord: this.aiModelsService.get(attrs.id),
    }),
    TE.chainW(() => this.aiModelsService.update(attrs)),
    this.tryTEIfUser.oneOfOrganizationRole('owner', 'tech'),
  );

  create = (dto: SdkCreateAIModelInputT) => pipe(
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

  search = (dto: SdkSearchAIModelsInputT) => pipe(
    this.permissionsService.asUser(this.jwt).enforceOrganizationScopeFilters(dto),
    TE.fromEither,
    TE.chainW(this.aiModelsService.search),
    TE.map((pagination) => {
      if (this.check.is.minimum.techUser) {
        return pagination;
      }

      return pipe(
        pagination,
        mapSdkOffsetPaginationItems(anonymizeAIModelCredentials),
      );
    }),
  );

  getDefault = flow(
    this.permissionsService.asUser(this.jwt).enforceMatchingOrganizationId,
    TE.fromEither,
    TE.chainW(this.aiModelsService.getDefault),
    TE.map((record) => {
      if (this.check.is.minimum.techUser) {
        return record;
      }

      return anonymizeAIModelCredentials(record);
    }),
  );
}

function anonymizeAIModelCredentials(aiModel: SdkAIModelT): SdkAIModelT {
  return {
    ...aiModel,
    credentials: {
      apiModel: '********',
      apiKey: '********',
    },
  };
}
