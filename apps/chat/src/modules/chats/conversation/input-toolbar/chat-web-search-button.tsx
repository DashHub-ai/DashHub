import { controlled } from '@under-control/forms';
import clsx from 'clsx';
import { GlobeIcon } from 'lucide-react';

import { useI18n } from '~/i18n';

type Props = {
  disabled?: boolean;
};

export const ChatWebSearchButton = controlled<boolean, Props>(({ disabled, control: { value, setValue } }) => {
  const t = useI18n().pack.chat;

  const onToggle = () => {
    setValue({
      value: !value,
    });
  };

  return (
    <button
      type="button"
      className={clsx(
        'p-2 rounded-lg transition-colors duration-200',
        value
          ? 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
      title={t.webSearch.toggle}
      disabled={disabled}
      onClick={onToggle}
    >
      <GlobeIcon size={20} />
    </button>
  );
});
