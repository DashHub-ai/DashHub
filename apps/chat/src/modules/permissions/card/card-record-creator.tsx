import clsx from 'clsx';
import { UserIcon } from 'lucide-react';

import type { SdkUserListItemT } from '@llm/sdk';

import { ColorizedAvatar, Tooltip } from '@llm/ui';
import { useI18n } from '~/i18n';

type Props = {
  creator: SdkUserListItemT;
  className?: string;
};

export function CardRecordCreator({ creator, className }: Props) {
  const t = useI18n().pack.permissions.card;

  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <div className="flex items-center gap-1.5 text-gray-500">
        <UserIcon size={16} />

        <span className="text-sm">
          {t.author}
          :
        </span>

        <Tooltip wrapperClassName="text-black text-secondary-foreground transform transition-transform hover:-translate-y-1" content={creator.email}>
          <div className="flex items-center gap-1.5">
            <ColorizedAvatar
              id={creator.id}
              name={creator.name}
              size="xs"
              className="shadow-sm"
            />

            {creator.name}
          </div>
        </Tooltip>
      </div>
    </div>
  );
}
