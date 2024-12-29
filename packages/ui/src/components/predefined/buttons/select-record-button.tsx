import type { ComponentProps } from 'react';

import clsx from 'clsx';
import { CheckIcon } from 'lucide-react';

import { useForwardedI18n } from '~/i18n';

type Props = Omit<ComponentProps<'button'>, 'children'> & {
  selected?: boolean;
  disabled?: boolean;
};

export function SelectRecordButton({ className, disabled, selected, ...props }: Props) {
  const t = useForwardedI18n().pack.buttons;

  return (
    <button
      type="button"
      disabled={disabled}
      className={clsx(
        'uk-button uk-button-secondary',
        selected && 'bg-gray-200',
        disabled && 'opacity-50 pointer-events-none uk-disabled',
        className,
      )}
      {...props}
    >
      {selected && (
        <>
          <CheckIcon size={16} className="mr-2" />
          {t.selected}
        </>
      )}
      {!selected && t.select}
    </button>
  );
}
