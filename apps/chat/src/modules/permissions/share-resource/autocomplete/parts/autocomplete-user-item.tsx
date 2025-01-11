import type { SdkUserListItemT } from '@llm/sdk';

import { Avatar } from '@llm/ui';

import { ChooseButton } from './choose-button';

type Props = {
  user: SdkUserListItemT;
  onSelect: (user: SdkUserListItemT) => void;
};

export function AutocompleteUserItem({ user, onSelect }: Props) {
  return (
    <div className="flex justify-between items-center hover:bg-gray-50 p-2 cursor-pointer">
      <div className="flex items-center gap-2">
        <Avatar size="sm" name={user.name} />

        <div>
          <div className="font-medium text-sm">{user.name}</div>
          <div className="text-gray-500 text-xs">{user.email}</div>
        </div>
      </div>

      <ChooseButton onClick={() => onSelect(user)} />
    </div>
  );
}
