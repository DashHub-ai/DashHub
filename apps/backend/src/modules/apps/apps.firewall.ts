import { taskEither as TE } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';

import { dropSdkPaginationPermissionsKeysIfNotCreator, type SdkJwtTokenT } from '@llm/sdk';
import { AuthFirewallService } from '~/modules/auth/firewall';

import type { PermissionsService } from '../permissions';
import type { AppsService } from './apps.service';
import type { EsAppsInternalFilters } from './elasticsearch';

export class AppsFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly appsService: AppsService,
    private readonly permissionsService: PermissionsService,
  ) {
    super(jwt);
  }

  unarchive = flow(
    this.appsService.unarchive,
    this.tryTEIfUser.is.root,
  );

  archive = flow(
    this.appsService.archive,
    this.tryTEIfUser.is.root,
  );

  update = flow(
    this.appsService.update,
    this.tryTEIfUser.is.root,
  );

  create = flow(
    this.appsService.create,
    this.tryTEIfUser.is.root,
  );

  get = flow(
    this.appsService.get,
    this.tryTEIfUser.is.root,
  );

  summarizeChatToApp = flow(
    this.appsService.summarizeChatToApp,
    this.tryTEIfUser.is.root,
  );

  search = (filters: EsAppsInternalFilters) => pipe(
    filters,
    this.permissionsService.asUser(this.jwt).enforceSatisfyPermissionsFilters('read'),
    TE.chainW(this.appsService.search),
    TE.map(dropSdkPaginationPermissionsKeysIfNotCreator(this.userId)),
  );
}
