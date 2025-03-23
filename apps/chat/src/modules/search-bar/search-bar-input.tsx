import type { ComponentProps } from 'react';

import clsx from 'clsx';
import { SearchIcon } from 'lucide-react';

import { useI18n } from '~/i18n';

type Props = ComponentProps<'input'> & {
  isExpanded?: boolean;
};

export function SearchBarInput({ className, isExpanded, ...inputProps }: Props) {
  const t = useI18n().pack.searchBar;

  return (
    <div
      className={clsx('group relative', className)}
    >
      <input
        type="text"
        placeholder={t.input.placeholder}
        className={clsx(
          'bg-gray-100/80 focus:bg-white focus:border-gray-200',
          'py-2 pr-4 pl-10 border border-transparent rounded-full focus:ring-0',
          'text-gray-800 text-sm transition-all duration-200 focus:outline-none placeholder-gray-500',
          isExpanded && 'w-80',
          !isExpanded && 'focus:w-80 w-22 lg:w-44',
        )}
        {...inputProps}
      />

      <SearchIcon
        size={18}
        className="top-1/2 left-3 absolute text-gray-500 -translate-y-1/2"
      />
    </div>
  );
}
