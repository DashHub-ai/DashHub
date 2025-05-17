import { taskEither as TE } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';

import type { SdkJwtTokenT, SdkUpdateOrganizationInputT } from '@dashhub/sdk';

import { AuthFirewallService } from '~/modules/auth/firewall';

import type { TableRowWithId } from '../database';
import type { PermissionsService } from '../permissions';
import type { OrganizationsService } from './organizations.service';

export class OrganizationsFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly organizationsService: OrganizationsService,
    private readonly permissionsService: PermissionsService,
  ) {
    super(jwt);
  }

  get = flow(
    this.organizationsService.get,
    this.permissionsService.asUser(this.jwt).chainValidateResultOrRaiseUnauthorized,
  );

  unarchive = flow(
    this.organizationsService.unarchive,
    this.tryTEIfUser.is.root,
  );

  archive = flow(
    this.organizationsService.archive,
    this.tryTEIfUser.is.root,
  );

  update = (attrs: SdkUpdateOrganizationInputT & TableRowWithId) => pipe(
    this.permissionsService.asUser(this.jwt).findRecordAndCheckOrganizationMatch({
      findRecord: this.organizationsService.get(attrs.id),
    }),
    TE.chainW(() => this.organizationsService.update(attrs)),
  );

  create = flow(
    this.organizationsService.create,
    this.tryTEIfUser.is.root,
  );

  search = flow(
    this.organizationsService.search,
    this.tryTEIfUser.is.root,
  );
}
