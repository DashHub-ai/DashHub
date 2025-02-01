import { controlled, type OmitControlStateAttrs } from '@under-control/forms';
import clsx from 'clsx';
import { LayoutGrid, List, Star } from 'lucide-react';

import { rejectFalsyItems } from '@llm/commons';
import { useI18n } from '~/i18n';
import { Tabs, type TabsProps } from '~/ui/components/tabs';

type Props = Omit<OmitControlStateAttrs<TabsProps>, 'tabs'> & {
  withAll?: boolean;
  totalFavorites: number;
};

export const FavoriteFiltersTabs = controlled<boolean | null, Props>((
  {
    control: { value, setValue },
    withAll = true,
    totalFavorites,
    className,
    ...props
  },
) => {
  const t = useI18n().pack.tabs.favoriteFilters;
  const tabs = rejectFalsyItems([
    {
      id: true,
      name: (
        <div className="flex items-center gap-2">
          {t.favorite}
          {totalFavorites > 0 && (
            <span
              className={clsx(
                'px-1.5 rounded-md min-w-[1.2rem] text-center text-white text-xs',
                value === true ? 'bg-yellow-500' : 'bg-gray-500',
              )}
            >
              {totalFavorites}
            </span>
          )}
        </div>
      ),
      icon: <Star size={16} />,
      disabled: !totalFavorites,
    },
    {
      id: false,
      name: t.rest,
      icon: <List size={16} />,
      disabled: !totalFavorites,
    },
    withAll && {
      id: -1,
      name: t.all,
      icon: <LayoutGrid size={16} />,
    },
  ]);

  return (
    <Tabs
      {...props}
      className={clsx(className, 'w-auto')}
      value={value ?? -1}
      onChange={(newValue) => {
        setValue({
          value: newValue === -1 ? null : Boolean(newValue),
        });
      }}
      tabs={tabs}
    />
  );
});
