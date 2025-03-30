import clsx from 'clsx';
import { PaperclipIcon } from 'lucide-react';

import { useI18n } from '~/i18n';

type Props = {
  disabled?: boolean;
};

export function AttachFileButton({ disabled }: Props) {
  const t = useI18n().pack.chat.actions.files;

  return (
    <button
      type="button"
      title={t.attachFile}
      className={clsx(
        'hover:bg-gray-100 p-2 rounded-lg',
        'text-gray-500 hover:text-gray-700',
        'transition-colors duration-200',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
      disabled={disabled}
    >
      <PaperclipIcon size={20} />
    </button>
  );
}
