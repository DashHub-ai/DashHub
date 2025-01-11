import clsx from 'clsx';

import { useI18n } from '~/i18n';

type Props = {
  onClick: () => void;
  disabled?: boolean;
};

export function ChooseButton({ onClick, disabled }: Props) {
  const { pack } = useI18n();

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        'px-3 py-1.5 rounded font-semibold text-xs',
        'text-gray-600 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      {pack.buttons.choose}
    </button>
  );
}
