import type { SdkJwtTokenT, SdkSearchShareResourceUsersGroupsInputT } from '@llm/sdk';

import type { ShareResourceService } from './share-resource.service';

import { AuthFirewallService } from '../auth';

export class ShareResourceFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly shareResourceService: ShareResourceService,
  ) {
    super(jwt);
  }

  searchShareableUsersAndGroups = (dto: SdkSearchShareResourceUsersGroupsInputT) =>
    this.shareResourceService.searchShareableUsersAndGroups({
      ...dto,
      user: this.userIdRow,
      showGroupsAssignedToUser: !this.check.is.minimum.techUser,
    });
}
