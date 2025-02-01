import type { PropsWithChildren } from 'react';

import {
  type ControlBindProps,
  controlled,
  pickEventValue,
} from '@under-control/forms';
import clsx from 'clsx';

type Props = ControlBindProps<boolean> & PropsWithChildren & {
  name?: string;
  disabled?: boolean;
  className?: string;
  checkboxClassName?: string;
};

export const Checkbox = controlled<boolean, Props>((
  {
    name,
    disabled,
    control: { setValue, value },
    children,
    className = 'uk-text-small',
    checkboxClassName = 'mt-[-2px]',
  },
) => (
  <label
    className={clsx(
      className,
      disabled && 'opacity-50 pointer-events-none',
    )}
  >
    <input
      name={name}
      disabled={disabled}
      className={clsx('uk-checkbox', checkboxClassName)}
      type="checkbox"
      checked={value}
      onChange={(event) => {
        setValue({
          value: pickEventValue(event),
        });
      }}
    />

    <span className="ml-2 cursor-pointer">
      {children}
    </span>
  </label>
));
