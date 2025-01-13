import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkJwtTokenT,
  SdkSearchShareResourceUsersGroupsInputT,
  SdkSearchShareResourceUsersGroupsOutputT,
} from '@llm/sdk';

import { pluckTyped, rejectById } from '@llm/commons';

import type { WithAuthFirewall } from '../auth';
import type { TableRowWithId } from '../database';

import { UsersService } from '../users';
import { UsersGroupsService } from '../users-groups';
import { ShareResourceFirewall } from './share-resource.firewall';

type SearchShareResourceGroupsInternalFilters = SdkSearchShareResourceUsersGroupsInputT & {
  user: TableRowWithId;
  showGroupsAssignedToUser?: boolean;
};

@injectable()
export class ShareResourceService implements WithAuthFirewall<ShareResourceFirewall> {
  constructor(
    @inject(UsersGroupsService) private readonly usersGroupsService: UsersGroupsService,
    @inject(UsersService) private readonly usersService: UsersService,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new ShareResourceFirewall(jwt, this);

  searchShareableUsersAndGroups = (
    {
      phrase,
      organizationId,
      user,
      showGroupsAssignedToUser,
    }: SearchShareResourceGroupsInternalFilters,
  ) => pipe(
    TE.Do,
    TE.bind('groups', () => pipe(
      this.usersGroupsService.search({
        phrase,
        archived: false,
        offset: 0,
        limit: 200,
        organizationIds: [organizationId],
        sort: 'score:desc',
        ...showGroupsAssignedToUser && {
          usersIds: [user.id],
        },
      }),
      TE.map(({ items }) => items),
    )),
    TE.bind('users', ({ groups }) => pipe(
      this.usersService.search({
        phrase,
        archived: false,
        offset: 0,
        limit: 200,
        sort: 'score:desc',
        organizationIds: [organizationId],
        excludeIds: [user.id],
        ids: pipe(
          groups.flatMap(({ users }) => users),
          pluckTyped('id'),
        ),
      }),
      TE.map(({ items }) => items),
    )),
    TE.map(({ groups, users }): SdkSearchShareResourceUsersGroupsOutputT => ({
      groups: groups.map(({ id, name }) => ({ id, name })),
      users: pipe(
        users,
        A.map(({ id, name, email }) => ({
          id,
          name,
          email,
        })),
        rejectById(user.id),
      ),
    })),
  );
}
