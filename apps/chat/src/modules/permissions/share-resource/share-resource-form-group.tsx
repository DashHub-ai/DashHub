import { controlled } from '@under-control/forms';

import {
  isSdkPublicPermissions,
  type SdkPermissionT,
  type SdkUserListItemT,
  useSdkForLoggedIn,
} from '@dashhub/sdk';
import { useI18n } from '~/i18n';
import { Checkbox } from '~/ui';

import { SearchUsersGroupsInput } from './autocomplete';
import { ResourcePermissionsList } from './list';

type Props = {
  creator?: SdkUserListItemT;
};

export const ShareResourceFormGroup = controlled<SdkPermissionT[], Props>(({ creator, control: { value, setValue } }) => {
  const { session: { token } } = useSdkForLoggedIn();

  const t = useI18n().pack.permissions.modal;
  const isPublic = isSdkPublicPermissions(value);

  const onTogglePublic = (newPublic: boolean) => {
    setValue({
      value: newPublic
        ? []
        : [
            {
              accessLevel: 'write',
              target: {
                type: 'user',
                user: {
                  id: token.sub,
                  name: token.name,
                  email: token.email,
                },
              },
            },
          ],
    });
  };

  const onSelected = (permission: SdkPermissionT) => {
    setValue({
      value: [permission, ...value],
    });
  };

  return (
    <div className="flex flex-col space-y-6">
      <Checkbox
        value={isPublic}
        onChange={onTogglePublic}
      >
        {t.makePublic}
      </Checkbox>

      {!isPublic && (
        <>
          <SearchUsersGroupsInput onSelected={onSelected} />
          <ResourcePermissionsList
            creator={creator}
            permissions={value}
            onChange={(newValue) => {
              setValue({ value: newValue });
            }}
          />
        </>
      )}
    </div>
  );
});
