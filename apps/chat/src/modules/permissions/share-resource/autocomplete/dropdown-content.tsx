import type { CSSProperties } from 'react';

import { createPortal } from 'react-dom';

import type { AsyncValueHookResult } from '@llm/commons-front';
import type { SdkSearchShareResourceUsersGroupsOutputT } from '@llm/sdk';

import { useI18n } from '~/i18n';

import {
  AutocompleteGroupItem,
  AutocompleteUserItem,
} from './parts';

type DropdownContentProps = {
  style: CSSProperties;
  result: AsyncValueHookResult<SdkSearchShareResourceUsersGroupsOutputT | null>;
  onSelect: () => void;
};

export function DropdownContent({ result, style, onSelect }: DropdownContentProps) {
  const t = useI18n().pack.permissions.modal.autocomplete;

  if (result.status === 'loading') {
    return createPortal(
      <div className="bg-white shadow-lg mt-1 p-4 border text-center text-gray-500" style={style}>
        {t.loading}
      </div>,
      document.body,
    );
  }

  if (result.status === 'success' && (result.data?.users.length || result.data?.groups.length)) {
    return createPortal(
      <div className="bg-white shadow-lg mt-1 border max-h-80 overflow-y-auto" style={style}>
        {result.data.users.length > 0 && (
          <div>
            <div className="bg-gray-50 px-3 py-2 font-medium text-gray-500 text-xs">
              {t.users}
            </div>

            {result.data.users.map(user => (
              <AutocompleteUserItem
                key={user.id}
                user={user}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
        {result.data.groups.length > 0 && (
          <div>
            <div className="bg-gray-50 px-3 py-2 font-medium text-gray-500 text-xs">
              {t.groups}
            </div>

            {result.data.groups.map(group => (
              <AutocompleteGroupItem
                key={group.id}
                group={group}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>,
      document.body,
    );
  }

  return null;
}
