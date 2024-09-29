import { controlled } from '@under-control/forms';
import clsx from 'clsx';

import { useI18n } from '~/i18n';

type Props = JSX.IntrinsicElements['input'];

export const PaginationSearchToolbarItem = controlled<string, Props>((
  {
    control: { value, bind },
    className,
    ...props
  },
) => {
  const t = useI18n().pack.pagination;

  return (
    <input
      className={clsx('uk-input w-[300px]', className)}
      name="email"
      type="email"
      placeholder={t.searchPlaceholder}
      value={value ?? ''}
      onChange={bind.entire().onChange}
      {...props}
    />
  );
});
