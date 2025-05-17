import { controlled } from '@under-control/forms';
import clsx from 'clsx';

import type { SdkTableRowWithIdNameT } from '@dashhub/sdk';

import { AppChatBadge } from '~/modules/apps/chat/app-chat-badge';

type Props = {
  apps: SdkTableRowWithIdNameT[];
  disabled?: boolean;
  className?: string;
};

export const ChatSelectApp = controlled<SdkTableRowWithIdNameT | null, Props>(
  ({ apps, disabled, className, control: { value, setValue } }) => {
    if (!apps.length) {
      return null;
    }

    return (
      <div className={clsx('flex flex-wrap items-center gap-2', className)}>
        {apps.map((app) => {
          const isSelected = value?.id === app.id;

          return (
            <AppChatBadge
              key={app.id}
              id={app.id}
              selected={isSelected}
              disabled={disabled}
              onClick={() => {
                setValue({
                  value: isSelected ? null : app,
                });
              }}
            />
          );
        })}
      </div>
    );
  },
);
