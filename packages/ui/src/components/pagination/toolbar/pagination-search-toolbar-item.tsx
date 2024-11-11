import { controlled } from '@under-control/forms';
import clsx from 'clsx';
import { SearchIcon } from 'lucide-react';

import { useForwardedI18n } from '~/i18n';

type Props = JSX.IntrinsicElements['div'];

export const PaginationSearchToolbarItem = controlled<string, Props>((
  {
    control: { value, bind },
    className,
    ...props
  },
) => {
  const t = useForwardedI18n().pack.pagination;

  return (
    <div className={clsx('relative', className)} {...props}>
      <input
        type="text"
        className="bg-white pl-8 w-[350px] uk-input"
        placeholder={t.searchPlaceholder}
        value={value ?? ''}
        onChange={bind.entire().onChange}
      />

      <SearchIcon size={16} className="top-1/2 left-2 absolute text-gray-400 -translate-y-1/2" />
    </div>
  );
});
