import type { PropsWithChildren } from 'react';

import {
  type ControlBindProps,
  controlled,
  pickEventValue,
} from '@under-control/forms';
import clsx from 'clsx';

type Props = ControlBindProps<boolean> & PropsWithChildren & {
  className?: string;
  checkboxClassName?: string;
};

export const Checkbox = controlled<boolean, Props>((
  {
    control: { setValue, value },
    children,
    className = 'uk-text-small',
    checkboxClassName = 'mt-[-2px]',
  },
) => (
  <label className={className}>
    <input
      className={clsx('uk-checkbox', checkboxClassName)}
      type="checkbox"
      checked={value}
      onChange={(event) => {
        setValue({
          value: pickEventValue(event),
        });
      }}
    />

    <span className="ml-2">{children}</span>
  </label>
));
