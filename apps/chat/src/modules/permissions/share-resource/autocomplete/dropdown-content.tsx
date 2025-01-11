import type { CSSProperties } from 'react';

import clsx from 'clsx';
import { createPortal } from 'react-dom';

import type { AsyncValueHookResult } from '@llm/commons-front';
import type { SdkPermissionT, SdkSearchShareResourceUsersGroupsOutputT } from '@llm/sdk';

import { useI18n } from '~/i18n';

import {
  AutocompleteGroupItem,
  AutocompleteUserItem,
} from './parts';

type Props = {
  ref: React.RefObject<HTMLDivElement | null>;
  style: CSSProperties;
  result: AsyncValueHookResult<SdkSearchShareResourceUsersGroupsOutputT | null>;
  onSelected: (permission: SdkPermissionT) => void;
};

export function DropdownContent({ ref, result, style, onSelected }: Props) {
  const t = useI18n().pack.permissions.modal.autocomplete;

  return createPortal(
    <div
      ref={ref}
      className={clsx(
        'empty:hidden bg-white shadow-lg mt-1 border rounded-md animate-slideIn',
        {
          'p-4 text-center text-gray-500': result.status === 'loading',
          'max-h-80 overflow-y-auto': result.status === 'success',
        },
      )}
      style={style}
    >
      {result.status === 'loading' && t.loading}
      {result.status === 'success' && result.data && (
        <>
          {result.data.users.length > 0 && (
            <div>
              <div className="bg-gray-50 px-4 py-3 font-medium text-gray-500 text-xs">
                {t.users}
              </div>
              {result.data.users.map(user => (
                <AutocompleteUserItem
                  key={user.id}
                  user={user}
                  onSelect={() => onSelected({
                    accessLevel: 'read',
                    target: {
                      type: 'user',
                      user,
                    },
                  })}
                />
              ))}
            </div>
          )}

          {result.data.groups.length > 0 && (
            <div>
              <div className="bg-gray-50 px-4 py-3 font-medium text-gray-500 text-xs">
                {t.groups}
              </div>
              {result.data.groups.map(group => (
                <AutocompleteGroupItem
                  key={group.id}
                  group={group}
                  onSelect={() => onSelected({
                    accessLevel: 'read',
                    target: {
                      type: 'group',
                      group,
                    },
                  })}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>,
    document.body,
  );
}
