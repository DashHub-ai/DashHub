import { controlled } from '@under-control/forms';

import type { SdkTableRowWithIdNameT } from '@llm/sdk';

import { AppChatBadge } from '~/modules/apps/chat/app-chat-badge';

type Props = {
  apps: SdkTableRowWithIdNameT[];
  disabled?: boolean;
};

export const ChatSelectApp = controlled<SdkTableRowWithIdNameT | null, Props>(
  ({ apps, disabled, control: { value, setValue } }) => {
    if (!apps.length) {
      return null;
    }

    return (
      <div className="flex flex-wrap items-center gap-2">
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
